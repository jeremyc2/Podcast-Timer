function setTheme(theme) {
    if(themes.indexOf(theme) !== -1) {
        document.body.style.setProperty('--color1', `var(--color${theme.id}1)`);
        document.body.style.setProperty('--color2', `var(--color${theme.id}2)`);
        document.body.style.setProperty('--color3', `var(--color${theme.id}3)`);
        document.body.style.setProperty('--color4', `var(--color${theme.id}4)`);

        if(theme.isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }
}

function initTheme() {
    currentThemeIndex = localStorage.getItem('theme-number') ?? 0;
    currentThemeIndex = parseInt(currentThemeIndex);
    setTheme(themes[currentThemeIndex]);
}

function rotateTheme() {
    if(currentThemeIndex >= themes.length - 1) {
        currentThemeIndex = 0;
    } else {
        currentThemeIndex++;
    }

    localStorage.setItem('theme-number', currentThemeIndex);

    setTheme(themes[currentThemeIndex]);
}

function logWidths() {
    document.querySelectorAll('.timer-label').forEach(el => {
        const a = el.getBoundingClientRect().width,
                b = el.querySelector('.progress div').getBoundingClientRect().width,
                expected = document.body.getBoundingClientRect().width 
                            - parseFloat(el.parentElement.style.getPropertyValue('--timer-width'));
        console.log(`${a} (${expected})\n${b} (${expected})`);
    });
}

function appendTimelessRow(row, timerLabel, countdown, content) {
    timerLabel.innerHTML = content.label;
    countdown.innerHTML = '&nbsp;&nbsp;-&nbsp;&nbsp;';
    row.addEventListener('click', function() {
        if(this.classList.contains('end-countdown')) {
            this.classList.remove('end-countdown');
            timerLabel.style.backgroundColor = '';
            timerLabel.style.color = '';
        } else {
            channel.postMessage({file: content.notes, teleprompter: !!content.teleprompter});
            this.classList.add('end-countdown');
            timerLabel.style.backgroundColor = 'unset';
            timerLabel.style.color = 'black';
        }
    });

    row.appendChild(timerLabel);
    row.appendChild(countdown);
    timers.appendChild(row);

    row.style.setProperty('--timer-width', `${countdown.getBoundingClientRect().width}px`);
}

function build(data) {
    data.forEach(timer => {
        const row = document.createElement('div'),
                timerLabel = document.createElement('div'),
                progress = document.createElement('div'),
                countdown = document.createElement('div');

        row.classList.add('row');
        timerLabel.classList.add('timer-label');
        progress.classList.add('progress');
        countdown.classList.add('countdown');

        if(timer.user) {
            timerLabel.classList.add(`user${timer.user}`);
        }

        if(timer.content.teleprompter) {
            timerLabel.classList.add('teleprompter');
        } else if(timer.content.notes) {
            timerLabel.classList.add('note');
        }

        var interval;

        const seconds = toSeconds(timer.time);

        if(seconds == null) {
            appendTimelessRow(row, timerLabel, countdown, timer.content);
            return;
        };

        row.style.setProperty('--time', `${seconds}s`);

        timerLabel.innerHTML = timer.content.label;
        progress.innerHTML = `<div>${timer.content.label}</div>`;
        countdown.innerHTML = timer.time;

        const defaultTotalTimeLabel = totalTime.innerText;

        row.addEventListener('click', function() {
            if(totalTime.innerText.trim() != defaultTotalTimeLabel) return;

            clearInterval(this.totalTimeInterval);

            var runningTime = '00:00';
            totalTime.setAttribute('data-time', runningTime);
            totalTime.innerText = `Total Time: ${runningTime}`;

            this.totalTimeInterval = setInterval(() => {
                runningTime = incrementTime(runningTime);
                totalTime.setAttribute('data-time', runningTime);
                totalTime.innerText = `Total Time: ${runningTime}`;
            }, 1000);
        });
    
        row.addEventListener('click', () => {

            var currTime = countdown.innerHTML = timer.time;

            if(row.classList.contains('start-countdown') || row.classList.contains('end-countdown')) {
                row.classList.remove('start-countdown');
                row.classList.remove('end-countdown');
                if(interval != null) {
                    clearInterval(interval);
                }
                return;
            }

            row.classList.add('start-countdown');
            channel.postMessage({file: timer.content.notes, teleprompter: !!timer.content.teleprompter});

            interval = setInterval(() => {
                currTime = decrementTime(currTime);
                if(!timeIsZero(currTime)) {
                    countdown.innerHTML = currTime;
                } else {
                    clearInterval(interval);
                    row.classList.remove('start-countdown');
                    row.classList.add('end-countdown');
                }
            }, 1000);
        });

        timerLabel.appendChild(progress);
        row.appendChild(timerLabel);
        row.appendChild(countdown);
        timers.appendChild(row);

        row.style.setProperty('--timer-width', `${countdown.getBoundingClientRect().width}px`);
    });
}

function setupPieTimer(pieTimer) {

    const time = pieTimer.getAttribute('data-time'),
            seconds = toSeconds(time);

    if(seconds == null) {
        return;
    };

    pieTimer.style.setProperty('--time', `${seconds}s`);
    pieTimer.querySelector('.pie-label').innerHTML = time;

    pieTimer.onclick = () => {

        var currTime = time;
        pieTimer.querySelector('.pie-label').innerHTML = time;
    
        if(pieTimer.classList.contains('start-pie')) {
            pieTimer.classList.remove('start-pie');
            if(pieTimer.interval != null) {
                clearInterval(pieTimer.interval);
            }
            return;
        }
    
        pieTimer.classList.add('start-pie');
    
        pieTimer.interval = setInterval(() => {
            currTime = decrementTime(currTime);
            if(timeIsZero(currTime)) {
                clearInterval(pieTimer.interval);
            }
            pieTimer.querySelector('.pie-label').innerHTML = currTime;
        }, 1000);
    }

}

function setCustomPieTime(pieTimer, timeMask) {
    if(pieTimer != null) {
        pieTimer.classList.remove('start-pie');
        clearInterval(pieTimer.interval);
        pieTimer.setAttribute('data-time', timeMask);
        setupPieTimer(pieTimer);
    }
}

function validateEditPie(pieInput) {
    if(pieInput.value.trim() == '') {
        pieInput.value = '00';
        return;
    }
    pieInput.value = pieInput.value.padStart(2, '0');
}

function allowDigitOnly(e) {
        if(e.key == 'Backspace' || e.key == 'Tab' || e.key == 'Enter') return;
        if(/^[1234567890]$/.test(e.key)) return;
        e.preventDefault();
}

const channel = new window.BroadcastChannel('app-data'),
    params = new URLSearchParams(document.location.search),
    id = params.get("id") ?? defaultId,
    notesOpenerActive = JSON.parse(params.get("notesOpenerActive")),              
    themes = [
        {id: 'A', isDark: false},
        {id: 'B', isDark: false},
        {id: 'C', isDark: true},
        {id: 'D', isDark: true}
    ];

var data,
    currentThemeIndex;

if(notesOpenerActive === false) {
    const notesIcon = document.querySelector('#notes-icon');
    notesIcon.parentElement.removeChild(notesIcon);
} else {
    var tryMeLink = document.querySelector('header #tryme');
    tryMeLink.style.display  = 'block !important';

    setTimeout(() => tryMeLink.style.display = '', 5000);
}

initTheme();

fetch(`data/main/${id}.json`).then(res => res.text()).then(res => {
    data = deepFreeze(JSON.parse(res));
    build(data);
});

document.querySelectorAll('.pie').forEach(setupPieTimer);

document.querySelectorAll('.edit-pie').forEach(el => {
    el.addEventListener('click', function() {
        const timer = this.previousElementSibling;
        timer.classList.remove('start-pie');
        clearInterval(timer.interval);
        var template = document.querySelector('#template-edit-pie');
        timer.querySelector('.pie-label').innerHTML = template.innerHTML;
        timer.querySelectorAll('.edit-pie-container, input').forEach(el => {
            el.addEventListener('blur', function(e) {
                const time = [...timer.querySelectorAll('input')].map(input => input.value);
                if(!e.relatedTarget?.classList.contains('edit-pie-input')) {
                    const newTime = `${time[0]}:${time[1]}`;

                    if(newTime == '00:00') {
                        setCustomPieTime(timer, timer.getAttribute('data-time'));
                    } else {
                        setCustomPieTime(timer, `${time[0]}:${time[1]}`);
                    }
                }
            });
        });
        timer.querySelector('input').focus();
    });
});