function logWidths() {
    document.querySelectorAll('.timer-label').forEach(el => {
        const a = el.getBoundingClientRect().width,
                b = el.querySelector('.progress div').getBoundingClientRect().width,
                expected = document.body.getBoundingClientRect().width 
                            - parseFloat(el.parentElement.style.getPropertyValue('--timer-width'));
        console.log(`${a} (${expected})\n${b} (${expected})`);
    });
}

function appendTimelessRow(row, timerLabel, countdown, text) {
    timerLabel.innerHTML = text;
    countdown.innerHTML = '&nbsp;&nbsp;-&nbsp;&nbsp;';
    row.addEventListener('click', function() {
        if(this.classList.contains('end-countdown')) {
            this.classList.remove('end-countdown');
            timerLabel.style.backgroundColor = '';
            timerLabel.style.color = '';
        } else {
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
            appendTimelessRow(row, timerLabel, countdown, timer.text);
            return;
        };

        row.style.setProperty('--time', `${seconds}s`);

        timerLabel.innerHTML = timer.text;
        progress.innerHTML = `<div>${timer.text}</div>`;
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

    var interval;

    const time = pieTimer.getAttribute('data-time'),
            seconds = toSeconds(time);

    if(seconds == null) {
        return;
    };

    pieTimer.style.setProperty('--time', `${seconds}s`);
    pieTimer.setAttribute('data-current-time', time);

    pieTimer.addEventListener('click', function() {

        var currTime = time;
        pieTimer.setAttribute('data-current-time', time);

        if(this.classList.contains('start-pie')) {
            this.classList.remove('start-pie');
            if(interval != null) {
                clearInterval(interval);
            }
            return;
        }

        this.classList.add('start-pie');

        interval = setInterval(() => {
            currTime = decrementTime(currTime);
            if(!timeIsZero(currTime)) {
                pieTimer.setAttribute('data-current-time', currTime);
            } else {
                clearInterval(interval);
                pieTimer.setAttribute('data-current-time', currTime);
            }
        }, 1000);
    });
}

function appendPie(timeMask) {
    const pie = document.createElement('div');
    pie.classList.add("pie");
    pie.setAttribute('data-time', timeMask);
    setupPieTimer(pie);
    pies.appendChild(pie);
}

document.addEventListener('data-loaded', build);

document.querySelectorAll('.pie').forEach(setupPieTimer);