let videoDuration = 0;
let timerVideo = null;

const playButton = document.querySelector('.play-pause');

const volume = document.querySelector('input[name="scroll-volume"]');
const scrollTime = document.querySelector('input[name="scroll-time"]');
const currentTime = document.querySelector('.actual-time');
const fullScreen = document.querySelector('.full-screen');

const formatTime = time => {
    let seconds = Math.round(time%60);
    seconds < 10 && (seconds = '0' + seconds);
    const formatted = Math.floor(time / 60) + ':' + seconds;
    return formatted;
};

const getDuration = () => {
    if (videoDom.duration > 0) {
        videoDuration = videoDom.duration;
        videoDom.volume = .5;
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
        scrollTime.value = beginTime;
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
videoDom.addEventListener('click',playPauseVideo);

const cursorMove = e => {
    pauseVideo();
    videoDom.currentTime = e.target.value;
    currentTime.textContent = formatTime(e.target.value);
}

changeVolume = e => {
    videoDom.volume = e.target.value / 10;
    document.querySelector('.volume').childNodes[3].setAttribute('src',`./ressources/${e.target.value == 0 ? 'mute' : 'unmute'}.svg`);
}

scrollTime.addEventListener('input',e => cursorMove(e));
volume.addEventListener('input',e => changeVolume(e));
volume.addEventListener('mouseup',e => {
    setTimeout(() => {
        volume.classList.add('hide');
    }, 500);
});

document.querySelector('.volume').childNodes[3].addEventListener('click',e => volume.classList.remove('hide'));

function fullScreenFunc() {
    if (!document.fullscreenElement) {
      document.querySelector('.video-container').requestFullscreen()
      .then(() => {

      })
      .catch((err) => {
        alert(`Il y a eu un problème sur le mode plein écran: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
}

fullScreen.addEventListener('click',fullScreenFunc);

document.addEventListener('keydown',e => {
    e.code === 'Space' && playPauseVideo();
});