// 150-160 words per minute (WPM) is also recommended for podcasts, radio hosts,
// and even YouTubers. This should be average for an entire show, while some of
// the passages should use a faster speaking rate while others slower.

// Since the length or duration of words is clearly variable, for the purpose of 
// measurement of text entry, the definition of each "word" is often standardized
// to be 5 characters or keystrokes long in English,
// including spaces and punctuation.
// Source: Wikipedia
const secondsPerLine = .1,
    container = document.querySelector('#app code pre');

var isScrolling = false;

function getCharacterDimensions() {
    const referenceElement = document.querySelector('#app code pre'),
        temp = document.createElement('span');

    temp.style.opacity = '0';
    temp.innerHTML = 'A';

    referenceElement.appendChild(temp);

    const height = temp.getBoundingClientRect().height,
        width = temp.getBoundingClientRect().width;

    referenceElement.removeChild(temp);

    return {height, width};
}

// Seconds per line to milliseconds for scrolling
function splToMilliseconds() {

    if(app.clientHeight == app.scrollHeight) return 0;

    const { height } = getCharacterDimensions();

    const milliseconds = (app.scrollHeight * secondsPerLine * 1000) / height;
    
    return milliseconds;
}

// Seconds per line to milliseconds for scrolling
function wpmToMilliseconds() {
    const text = document.querySelector('#app code pre').innerText,
        length = text.length;

    // TODO calculate Milliseconds
    // app.scrollHeight * ;
}

function stopScroll() {
    $('#app').stop();
}

function startScroll() {
    $('#app').animate({
        scrollTop: app.scrollHeight
    }, wpmToMilliseconds(), 'linear');
}

document.addEventListener('keydown', e => {
    if(e.code == 'Space') {
        if(isScrolling) {
            app.classList.remove('scrolling');
            stopScroll();
            isScrolling = false;
        } else {
            app.classList.add('scrolling');
            startScroll();
            isScrolling = true;
        }
        e.preventDefault();
    }
});

app.addEventListener('mousewheel', e => {
    if(isScrolling) {
        e.preventDefault();
    }
});

const file = new URLSearchParams(document.location.search).get("file") ?? 'test.txt';

fetch(`data/teleprompter/${file}`).then(res => res.text()).then(res => {
    container.innerText = res;
});
