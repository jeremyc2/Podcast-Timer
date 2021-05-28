// If CSS custom properties is not supported by browser
if (typeof CSS.registerProperty !== 'function') {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'css/pie-timer-polyfill.css';
    
    document.head.appendChild(style);
    document.querySelectorAll('.pie').forEach(pie => {

        const pieLabel = pie.querySelector('.pie-label'),
            spinner = document.createElement('div'),
            filler = document.createElement('div'),
            mask = document.createElement('div');

        spinner.classList.add('spinner');
        filler.classList.add('filler');
        mask.classList.add('mask');

        pie.insertBefore(spinner, pieLabel);
        pie.insertBefore(filler, pieLabel);
        pie.insertBefore(mask, pieLabel);
    });
}