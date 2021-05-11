function logWidths() {
    document.querySelectorAll('.timer-label').forEach(el => {
        const a = el.getBoundingClientRect().width,
                b = el.querySelector('.progress div').getBoundingClientRect().width,
                expected = document.body.getBoundingClientRect().width 
                            - parseFloat(el.parentElement.style.getPropertyValue('--timer-width'));
        console.log(`${a} (${expected})\n${b} (${expected})`);
    });
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

        row.style.setProperty('--time', `${toSeconds(timer.time)}s`);

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

document.addEventListener('data-loaded', build);

document.querySelectorAll('.pie').forEach(pieTimer => {

    var interval;

    const time = parseInt(pieTimer.getAttribute('data-seconds'));
    pieTimer.setAttribute('data-current-seconds', time);

    pieTimer.addEventListener('click', function() {

        var currTime = time;
        pieTimer.setAttribute('data-current-seconds', time);

        if(this.classList.contains('start-pie')) {
            this.classList.remove('start-pie');
            if(interval != null) {
                clearInterval(interval);
            }
            return;
        }

        this.classList.add('start-pie');

        interval = setInterval(() => {
            currTime--;
            if(currTime >= 0) {
                pieTimer.setAttribute('data-current-seconds', currTime);
            } else {
                clearInterval(interval);
            }
        }, 1000);
    });
});