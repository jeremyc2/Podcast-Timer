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

        timerLabel.innerHTML = timer.text;
        progress.innerHTML = `<div>${timer.text}</div>`;
        countdown.innerHTML = timer.seconds;

        progress.style.transition = `${timer.seconds}s linear`;
        progress.addEventListener('transitionend', () => {
            row.classList.remove('timer-running');
            row.classList.add('timer-finished');
        });

        row.addEventListener('click', () => {
            if(row.classList.contains('timer-running') || row.classList.contains('timer-finished')) return;

            row.classList.add('timer-running');

            var time = timer.seconds;

            var interval = setInterval(() => {
                time--;
                if(time > 0) {
                    countdown.innerHTML = time;
                } else {
                    clearInterval(interval);
                }
            }, 1000);

        });

        timerLabel.appendChild(progress);
        row.appendChild(timerLabel);
        row.appendChild(countdown);
        app.appendChild(row);

    });
}

document.addEventListener('data-loaded', build);