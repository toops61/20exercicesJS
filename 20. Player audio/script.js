let songsArray = [];
let songSelectedIndex = 0;

let timer = 0;
let timerInterval = null;
let songDuration = 0;
let timeLeft = false;
let playing = false;

const playPause = document.querySelector('.play-pause');
const songSelected = document.querySelector('audio');
const volumeButtons = document.querySelectorAll('.volume');

songSelected.volume = .5;

let songTags = {};

//check mp3 audio files in music folder
const getMusicFiles = async () => {
  try {
    const response = await fetch('./ressources/music');
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const songsList = await response.text();
    songsArray = songsList.split('ressources/music/').filter(e => (e.includes('.mp3') || e.includes('.m4a')) && !e.includes('DOCTYPE'));
    songsArray = songsArray.map(el => {
      return el.split('" class')[0];
    });
    loadSong(0);
  } catch (error) {
    console.log(error);
    displayAlert('Nous n\'avons pas pu récupérer les morceaux, réessayez.');
  }
}
getMusicFiles();

const displayCover = tags => {
  const data = tags.picture.data;
  const format = tags.picture.format;
  let base64String = "";
  data.map(e => base64String += String.fromCharCode(e));
  const imageUrl = `data:${format};base64,${window.btoa(base64String)}`;
  document.querySelector('.screen-container img').setAttribute('src',imageUrl);
}

const displayMetadata = tags => {
  const title = document.querySelector('.title');
  const artist = tags.artist;
  title.childNodes[1].textContent = artist;
  const songName = tags.title;
  title.childNodes[3].textContent = songName;
  const album = tags.album;
  title.childNodes[5].textContent = album
  ;
}

//check songs metadata
const getTags = async () => {
  return await jsmediatags.read(songSelected.src, {
    onSuccess: tag => {
      //console.log(tag);
      tag.tags.picture ? displayCover(tag.tags) : document.querySelector('.screen-container img').setAttribute('src','');
      displayMetadata(tag.tags);
    },
    onError: error => console.log(error)
  })
}

const fillSongIndexDisplayed = () => {
  document.querySelector('.title-number p').textContent = `${songSelectedIndex+1}/${songsArray.length}`;
}

const loadSong = () => {
  songSelected.setAttribute('src',`./ressources/music/${songsArray[songSelectedIndex]}`);
  fillSongIndexDisplayed();
  getTags();
}

//convert time to mm:ss format
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
//get duration of song if changes
songSelected.addEventListener('durationchange',getDuration);

//display progress bar
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

const randomSelectSong = () => {
  songSelectedIndex = Math.round(Math.random()*songsArray.length);
  loadSong();
}

const playTimer = () => {
  timerInterval = setInterval(() => {
    timer++;
    displayTimeBar();
    displayTimes();
    if (songSelected.currentTime == songDuration) {
      //clearInterval(timerInterval);
      if (!document.querySelector('.repeat').className.includes('selected') && songSelectedIndex == (songsArray.length-1)) {
        pauseSong();
        playPause.classList.toggle('active');
        nextSong();
      } else {
        !document.querySelector('.repeat').className.includes('repeat-one') ? nextSong() : (timer = 0 && songSelected.play());
      }
    } 
  }, 1000);
}

const playSong = () => {
  if (document.querySelector('.random').className.includes('selected') && timer == 0) {
    randomSelectSong();
  }
  songSelected.play();
  playing = true;
  playTimer();
}

const pauseSong = () => {
  clearInterval(timerInterval);
  songSelected.pause();
  playing = false;
}

const playPauseFunction = () => {
  playPause.classList.toggle('active');
  playPause.className.includes('active') ? playSong() : pauseSong();
}

playPause.addEventListener('click',playPauseFunction);

const nextSong = () => {
  songSelectedIndex = songSelectedIndex < (songsArray.length-1) ? songSelectedIndex+1 : 0;
  timer = 0;
  loadSong();
  playing && songSelected.play();
  displayTimeBar();
  displayTimes();
}

document.querySelector('.forward').addEventListener('click',nextSong);

const previousButton = () => {
  if (songSelected.currentTime >= 1) {
    songSelected.currentTime = 0;
  } else {
    songSelectedIndex = songSelectedIndex > 0 ? songSelectedIndex-1 : 0;
    loadSong();
  }
  timer = 0;
  displayTimeBar();
  displayTimes();
  playing && songSelected.play();
}

document.querySelector('.backward').addEventListener('click',previousButton);

const jumpCurrent = e => {
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

const handleRepeat = e => {
  const classTarget = document.querySelector('.repeat').classList;
  classTarget.value.includes('repeat-one') ? e.target.className = 'repeat' : 
  (classTarget.value.includes('selected') ? classTarget.add('repeat-one') : classTarget.add('selected'));
}

document.querySelector('.random').addEventListener('click',e => e.target.classList.toggle('selected'));
document.querySelector('.repeat').addEventListener('click',handleRepeat);