function decrementTime(timeMask) {
    var [minutes, seconds] = timeMask.split(':').map(t => parseInt(t));

    if(seconds > 0) {
        seconds--;
    } else {
        minutes--;
        seconds = 59;
    }

    if(minutes < 0) return '00:00';

    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
}

function toSeconds(timeMask) {

    if(typeof timeMask !== 'string') return;

    var [minutes, seconds] = timeMask.split(':').map(t => parseInt(t));

    var res = minutes * 60 + seconds;

    if(isNaN(res)) return;

    return res;
}

function timeIsZero(timeMask) {
    return timeMask == '00:00';
}