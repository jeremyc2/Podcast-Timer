const secondsPerLine = 10;

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