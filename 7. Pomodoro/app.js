let workTimer = 1800;
let restTimer = 300;
let cycle = 1;

let workTimerInterval = null;
let restTimerInterval = null;

const divAnimArray = document.querySelectorAll('.title-container div');
const containerAnimArray = document.querySelectorAll('.timer');

const clearAllTimer = () => {
    clearInterval(workTimerInterval);
    workTimerInterval = null;
    clearInterval(restTimerInterval);
    restTimerInterval = null;
    play = false;
}

let play = false;

const checkStatus = () => {
    document.querySelectorAll('button')[0].className = !play ? 'play' : 'pause';
}

const formatTimer = timer => {
    const minutes = Math.floor(timer / 60);
    const secondes = timer % 60;
    return `${minutes}:${secondes >= 10 ? secondes : ('0'+secondes)}`;
}

const displayTimers = () => {
    document.querySelector('.rest__time').textContent = formatTimer(restTimer);
    document.querySelector('.work__time').textContent = formatTimer(workTimer);
}

const setTimerRest = () => {
    !divAnimArray[1].className.includes('animation-time') && (divAnimArray[1].className = 'animation-time');
    !containerAnimArray[1].className.includes('selected') && containerAnimArray[1].classList.add('selected');
    if (!play) {
        play = true;
        divAnimArray[1].classList.add('animation');
        !restTimerInterval && (
            restTimerInterval = setInterval(() => {
                if (restTimer > 0) {
                    restTimer--;
                    document.querySelector('.rest__time').textContent = formatTimer(restTimer);
                } else {
                    resetTimers();
                    cycle++;
                    divAnimArray[1].className = '';
                    containerAnimArray[1].classList.remove('selected')
                    setTimerWork();
                }
            }, 1000))
        } else {
            play = false;
            divAnimArray[1].classList.remove('animation');
            clearInterval(restTimerInterval);
            restTimerInterval = null;
        }
    }
    
const setTimerWork = () => {
    document.querySelector('.cycle-container').textContent = `Cycle : ${cycle}`;
    !divAnimArray[0].className.includes('animation-time') && (divAnimArray[0].className = 'animation-time');
    !containerAnimArray[0].className.includes('selected') && containerAnimArray[0].classList.add('selected');
    if (!play) {
        play = true;
        divAnimArray[0].classList.add('animation');
        workTimer == 1800 && checkStatus();
        !workTimerInterval && (
            workTimerInterval = setInterval(() => {
                if (workTimer > 0) {
                    workTimer--;
                    document.querySelector('.work__time').textContent = formatTimer(workTimer);
                } else {
                    play = false;
                    clearAllTimer();
                    setTimerRest();
                    divAnimArray[0].className = '';
                    containerAnimArray[0].classList.remove('selected')
                }
            }, 1000)
        )
    } else {
        play = false;
        divAnimArray[0].classList.remove('animation');
        clearInterval(workTimerInterval);
        workTimerInterval = null;
    }
}

const resetTimers = () => {
    clearAllTimer();
    workTimer = 1800;
    restTimer = 300;
    cycle = 1;
    displayTimers();
    play = false;
    checkStatus();
    divAnimArray[0].className = '';
    divAnimArray[1].className = '';
    containerAnimArray[0].className = 'timer';
    containerAnimArray[1].className = 'timer';
}

const pausePlay = () => {
    workTimer == 0 ? setTimerRest() : setTimerWork();
    checkStatus();
}

document.querySelectorAll('button')[0].addEventListener('click',pausePlay);
document.querySelector('.reset').addEventListener('click',resetTimers);