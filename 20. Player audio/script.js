const musicsData = [
  { title: "Solar", artist: "Betical", id: 1 },
  { title: "Electric-Feel", artist: "TEEMID", id: 2 },
  { title: "Aurora", artist: "SLUMB", id: 3 },
  { title: "Lost-Colours", artist: "Fakear", id: 4 },
];

let timer = 0;
let timerInterval = null;
let songDuration = 0;
let timeLeft = false;

const playPause = document.querySelector('.play-pause');
const songSelected = document.querySelector('audio');
const volumeButtons = document.querySelectorAll('.volume');

songSelected.volume = .5;

const convertTime = time => {
  const minutes = Math.floor(time/60);
  let seconds = Math.round(time%60);
  seconds < 10 && (seconds = `0${seconds}`);
  return `${minutes}:${seconds}`
}

const getDuration = () => {
  if (songSelected.duration > 0) {
      songDuration = songSelected.duration;
      document.querySelectorAll('.time p')[1].textContent = convertTime(songDuration);
      document.querySelector('#progress-input').setAttribute('max',Math.ceil(songDuration));
  }
};

songSelected.addEventListener('durationchange',getDuration);

const displayTimeBar = () => {
  const duration = songDuration;
  const current = songSelected.currentTime;
  const progress = -100 + (current*100)/duration;
  document.querySelector('.progress').style.transform = `translateX(${progress}%)`;
}

const displayTimes = () => {
  const leftTime = songDuration - songSelected.currentTime;
  document.querySelectorAll('.time p')[0].textContent = timeLeft ? `-${convertTime(leftTime)}`: convertTime(timer);
}

const playTimer = () => {
  songSelected.play();
  timerInterval = setInterval(() => {
    timer++;
    displayTimeBar();
    displayTimes();
    timer >= songDuration && clearInterval(timerInterval);
  }, 1000);
}

const pauseSong = () => {
  clearInterval(timerInterval);
  songSelected.pause();
}

const playPauseFunction = () => {
  playPause.classList.toggle('active');
  playPause.className.includes('active') ? playTimer() : pauseSong();
}

playPause.addEventListener('click',playPauseFunction);

const jumpCurrent = e => {
  console.log(e.target.value);
  songSelected.currentTime = e.target.value;
  timer = e.target.value;
  displayTimeBar();
  displayTimes();
}

document.querySelector('#progress-input').addEventListener('click',jumpCurrent);

document.querySelector('.time').addEventListener('click',e => {
  timeLeft = !timeLeft;
  displayTimes();
});

//change volume with side buttons
const toggleVolume = (index) => {
  switch (index) {
    case 0:
      songSelected.volume < 1 && (songSelected.volume += .1)
      break;
    case 1:
      songSelected.volume >= .1 && (songSelected.volume -= .1)
      break;
  }
}

volumeButtons[0].addEventListener('click',e => toggleVolume(0));
volumeButtons[1].addEventListener('click',e => toggleVolume(1));