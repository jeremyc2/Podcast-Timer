// 150-160 words per minute (WPM) is also recommended for podcasts, radio hosts,
// and even YouTubers. This should be average for an entire show, while some of
// the passages should use a faster speaking rate while others slower.

// Since the length or duration of words is clearly variable, for the purpose of 
// measurement of text entry, the definition of each "word" is often standardized
// to be 5 characters or keystrokes long in English,
// including spaces and punctuation.
// Source: Wikipedia
const container = document.querySelector('#app code pre'),
    spacer = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

var secondsPerLine = 10,
    wordsPerMinute = 150,
    isScrolling = false;

function getCharacterDimensions() {
    const temp = document.createElement('span');

    temp.style.opacity = '0';
    temp.innerHTML = 'A';

    container.appendChild(temp);

    const height = temp.getBoundingClientRect().height,
        width = temp.getBoundingClientRect().width;

    container.removeChild(temp);

    return {height, width};
}

// Seconds per line to milliseconds for scroll time
function splToMilliseconds(spl) {

    if(app.clientHeight == app.scrollHeight) return 0;

    const { height } = getCharacterDimensions();

    const milliseconds = (app.scrollHeight * spl * 1000) / height;
    
    return milliseconds;
}

// Words per minute to milliseconds for scroll time
function wpmToMilliseconds(wpm) {

    if(app.clientHeight == app.scrollHeight) return 0;

    const text = container.innerText,
        words = text.length / 5;

    return 60000 * words / wpm;
}

function stopScroll() {
    app.classList.remove('scrolling');
    isScrolling = false;
    $('#app').stop();
}

function startScroll() {
    app.classList.add('scrolling');
    isScrolling = true;

    const milliseconds = wpmToMilliseconds(wordsPerMinute);
    $('#app').animate({
        scrollTop: app.scrollHeight
    }, milliseconds, 'linear');

    document.querySelector('footer').innerHTML = 
        `${wordsPerMinute} WPM (Recommended)${spacer}Total Duration &#8212; ` +
            `${Math.floor(milliseconds / 60000)}`.padStart(2,'0') + ':' + 
            `${Math.floor((milliseconds % 60000) / 1000)}`.padStart(2,'0');
}

// FIXME Acceleration on ArrowUp and ArrowDown to change scroll speed should be constant
document.addEventListener('keydown', e => {
    if(e.code == 'Space') {
        e.preventDefault();
    } else if(e.code == 'ArrowUp' && isScrolling) {

        if(wordsPerMinute < 0) {
            wordsPerMinute = 0;
        }

        stopScroll();
        wordsPerMinute++;
        startScroll();
    } else if (e.code == 'ArrowDown' && isScrolling) {

        if(wordsPerMinute <= 0) {
            wordsPerMinute = 0;
            return;
        };

        stopScroll();
        wordsPerMinute--;
        startScroll();
    }
});

document.addEventListener('keyup', e => {
    if(e.code == 'Space') {
        if(isScrolling) {
            stopScroll();
        } else {
            startScroll();
        }
    }
});

app.addEventListener('mousewheel', e => {
    if(isScrolling) {
        e.preventDefault();
    }
});

const file = new URLSearchParams(document.location.search).get("file") ?? 'test.txt';

fetch(`data/notes/${file}`).then(res => res.text()).then(res => {
    container.innerText = res;
    startScroll();
});