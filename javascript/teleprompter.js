const linesPerSecond = 10;

function getLineHeight() {
    const referenceElement = document.querySelector('#app code pre');

    var temp = document.createElement('div'), height;
    temp.style.opacity = '0';
    temp.innerHTML = 'A';

    referenceElement.appendChild(temp);
    height = temp.clientHeight;
    referenceElement.removeChild(temp);

    console.log(height);

    return height;
}

$('#app').animate({
    scrollTop: app.scrollHeight
}, getLineHeight());