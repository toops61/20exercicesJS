let workTimer = 1800;
let restTimer = 300;
let cycle = 1;

let workTimerIntervall = null;
let restTimerIntervall = null;

const clearAllTimer = () => {
    clearInterval(workTimerIntervall);
    workTimerIntervall = null;
    clearInterval(restTimerIntervall);
    restTimerIntervall = null;
    play = false;
}

let play = false;

const formatTimer = timer => {
    const minutes = Math.floor(timer / 60);
    const secondes = timer % 60;
    return `${minutes}:${secondes > 10 ? secondes : ('0'+secondes)}`;
}

const displayTimers = () => {
    document.querySelector('.rest__time').textContent = formatTimer(restTimer);
    document.querySelector('.work__time').textContent = formatTimer(workTimer);
}

const setTimerRest = () => {
    if (!play) {
        play = true;
        !restTimerIntervall && (
            restTimerIntervall = setInterval(() => {
                if (restTimer > 0) {
                    restTimer--;
                    document.querySelector('.rest__time').textContent = formatTimer(restTimer);
                } else {
                    resetTimers();
                    cycle++;
                    setTimerWork();
                }
            }, 1000))
        } else {
            play = false;
            clearInterval(restTimerIntervall);
            restTimerIntervall = null;
        }
    }
    
const setTimerWork = () => {
    document.querySelector('.cycle-container').textContent = `Cycle : ${cycle}`;
    if (!play) {
        play = true;
        !workTimerIntervall && (
            workTimerIntervall = setInterval(() => {
            if (workTimer > 0) {
                workTimer--;
                document.querySelector('.work__time').textContent = formatTimer(workTimer);
            } else {
                play = false;
                clearAllTimer();
                setTimerRest();
            }
        }, 1000))
    } else {
        play = false;
        clearInterval(workTimerIntervall);
        workTimerIntervall = null;
    }
}

const resetTimers = () => {
    clearAllTimer();
    workTimer = 1800;
    restTimer = 300;
    cycle = 1;
    displayTimers();
    play = false;
}

const pausePlay = () => {
    workTimer == 0 ? setTimerRest() : setTimerWork();
}

document.querySelector('.play').addEventListener('click',pausePlay);
document.querySelector('.reset').addEventListener('click',resetTimers);