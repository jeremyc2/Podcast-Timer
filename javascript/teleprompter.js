// TODO Make words per minute
const secondsPerLine = .1,
    container = document.querySelector('#app code pre');

var isScrolling = false;

function getLineHeight() {
    const referenceElement = document.querySelector('#app code pre');

    var temp = document.createElement('div'), height;
    temp.style.opacity = '0';
    temp.innerHTML = 'A';

    referenceElement.appendChild(temp);
    height = temp.clientHeight;
    referenceElement.removeChild(temp);

    return height;
}

function calcMilliseconds() {

    if(app.clientHeight == app.scrollHeight) return 0;

    const milliseconds = (app.scrollHeight * secondsPerLine * 1000) / getLineHeight();
    return milliseconds;
}

function stopScroll() {
    $('#app').stop();
}

function startScroll() {
    $('#app').animate({
        scrollTop: app.scrollHeight
    }, calcMilliseconds(), 'linear');
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