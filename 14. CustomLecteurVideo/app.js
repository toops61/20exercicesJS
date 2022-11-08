let videoDuration = 0;
let timerVideo = null;

const playButton = document.querySelector('.play-pause');

const volume = document.querySelector('input[name="volume"]');
const scrollTime = document.querySelector('input[name="scroll-time"]');
const currentTime = document.querySelector('.actual-time');

const formatTime = time => {
    let seconds = Math.round(time%60);
    seconds < 10 && (seconds = '0' + seconds);
    const formatted = Math.floor(time / 60) + ':' + seconds;
    return formatted;
};

const getDuration = () => {
    if (videoDom.duration > 0) {
        videoDuration = videoDom.duration;
        videoDom.volume = .1;
        totalTime = formatTime(videoDuration);
        document.querySelector('.total-time').textContent = totalTime;
        secondsDuration = Math.ceil(videoDuration);
        scrollTime.setAttribute('max',secondsDuration);
    } 
};

const videoDom = document.querySelector('video');
videoDom.addEventListener('durationchange',getDuration);

const playVideo = () => {
    playButton.childNodes[1].setAttribute('src','./ressources/pause.svg');
    videoDom.play();
    let beginTime = Math.round(videoDom.currentTime);
    timerVideo = setInterval(() => {
        beginTime++;
        currentTime.textContent = formatTime(beginTime);
    }, 1000);
}

const pauseVideo = () => {
    playButton.childNodes[1].setAttribute('src','./ressources/play.svg');
    clearInterval(timerVideo);
    videoDom.pause();
}

const playPauseVideo = () => {
    playButton.childNodes[1].src.includes('play') ? playVideo() : pauseVideo();
}

playButton.addEventListener('click',playPauseVideo);

const cursorMove = e => {
    //videoDom.volume = 1;
    videoDom.currentTime = e.target.value;
    currentTime.textContent = formatTime(e.target.value);
}

scrollTime.addEventListener('input',e => cursorMove(e));