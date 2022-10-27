let workTimer = 1800;
let restTimer = 300;
let cycle = 0;

let workTimerInterval = null;
let restTimerInterval = null;
let timerInterval = null;

const divAnimArray = document.querySelectorAll('.title-container div');
const containerAnimArray = document.querySelectorAll('.timer');

const clearTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
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

const decreaseFunc = ind => {
    let timer = ind == 0 ? workTimer : restTimer;
    if (timer > 0) {
        ind == 0 ? workTimer-- : restTimer--;
        displayTimers();
    } else {
        play = false;
        ind == 0 ? clearTimer() : endCycle();
        ind == 0 ? setTimer(1) : setTimer(0);
        divAnimArray[ind].className = '';
        containerAnimArray[ind].classList.remove('selected')
    }
}

const setTimer = index => {
    let timer = index == 0 ? workTimer : restTimer;
    timer == 1800 && cycle++;
    document.querySelector('.cycle-container').textContent = `Cycle : ${cycle}`;
    const init = index == 0 ? 1800 : 300;
    restTimer == init && timer--;
    displayTimers();
    !divAnimArray[index].className.includes('animation-time') && (divAnimArray[index].className = 'animation-time');
    !containerAnimArray[index].className.includes('selected') && containerAnimArray[index].classList.add('selected');
    if (!play) {
        play = true;
        checkStatus();
        divAnimArray[index].classList.add('animation');
        !timerInterval && (
            timerInterval = setInterval(() => {
                decreaseFunc(index);
            }, 1000)
        )
    } else {
        play = false;
        divAnimArray[index].classList.remove('animation');
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

const endCycle = () => {
    clearTimer();
    workTimer = 1800;
    restTimer = 300;
    displayTimers();
    play = false;
    checkStatus();
    divAnimArray[0].className = '';
    divAnimArray[1].className = '';
    containerAnimArray[0].className = 'timer';
    containerAnimArray[1].className = 'timer';
}

const resetTimers = () => {
    cycle = 0;
    document.querySelector('.cycle-container').textContent = `Cycle : ${cycle}`;
    endCycle();
}

const pausePlay = () => {
    workTimer == 0 ? setTimer(1) : setTimer(0);
    checkStatus();
}

document.querySelectorAll('button')[0].addEventListener('click',pausePlay);
document.querySelector('.reset').addEventListener('click',resetTimers);