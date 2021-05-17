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
            if((typeof content.detailsFilename == 'string') && 
                (content.detailsFilename != '')) {
                    channel.postMessage(content.detailsFilename);
            }
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

function build() {
    data.forEach(timer => {
        const row = document.createElement('div'),
                timerLabel = document.createElement('div'),
                progress = document.createElement('div'),
                countdown = document.createElement('div');

        row.classList.add('row');
        timerLabel.classList.add('timer-label');
        progress.classList.add('progress');
        countdown.classList.add('countdown');

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
            if((typeof timer.content.detailsFilename == 'string') &&
                (timer.content.detailsFilename != '')) {
                    channel.postMessage(timer.content.detailsFilename);
            }

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
    pieTimer.querySelector('div').innerHTML = time;

    pieTimer.onclick = () => {

        var currTime = time;
        pieTimer.querySelector('div').innerHTML = time;
    
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
            pieTimer.querySelector('div').innerHTML = currTime;
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

const channel = new BroadcastChannel('app-data');

document.addEventListener('data-loaded', build);

document.querySelectorAll('.pie').forEach(setupPieTimer);

document.querySelectorAll('.edit-pie').forEach(el => {
    el.addEventListener('click', function() {
        const timer = this.previousElementSibling;
        timer.classList.remove('start-pie');
        clearInterval(timer.interval);
        var template = document.querySelector('#template-edit-pie');
        timer.querySelector('div').innerHTML = template.innerHTML;
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