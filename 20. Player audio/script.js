let songsArray = [];
let songSelectedIndex = 0;

let playedSongs = [];

let timer = 0;
let timerInterval = null;
let songDuration = 0;
let timeLeft = false;
let playing = false;

const playPause = document.querySelector('.play-pause');
const songSelected = document.querySelector('audio');
const volumeButtons = document.querySelectorAll('.volume');

const repeatDom = document.querySelector('.repeat');

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
      const screenCover = document.querySelector('.screen-container');
      tag.tags.picture ? displayCover(tag.tags) : screenCover.childNodes[1].setAttribute('src','');
      tag.tags.picture ? screenCover.classList.remove('no-picture') : screenCover.classList.add('no-picture');
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
      //document.querySelector('#progress-input').setAttribute('max',Math.ceil(songDuration));
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

const jumpCurrent = e => {
  const duration = songDuration;
  const clickPosition = e.target.className === 'progress-bar' ? e.offsetX : e.layerX;
  const barLength = document.querySelector('.progress-bar').offsetWidth;
  const x = (clickPosition * duration) / barLength;
  songSelected.currentTime = x;
  timer = x;
  displayTimeBar();
  displayTimes();
}

document.querySelector('.progress-bar').addEventListener('click',jumpCurrent);

const displayTimes = () => {
  const leftTime = songDuration - songSelected.currentTime;
  document.querySelectorAll('.time p')[0].textContent = timeLeft ? `-${convertTime(leftTime)}`: convertTime(timer);
}

const randomSelectSong = () => {
  timer = 0;
  songSelectedIndex = Math.round(Math.random()*(songsArray.length-1));
  !playedSongs.includes(songSelectedIndex) ? loadSong() : randomSelectSong();
}

const playTimer = () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    displayTimeBar();
    displayTimes();
    if (songSelected.currentTime == songDuration) {
      if (!repeatDom.className.includes('selected') && songSelectedIndex == (songsArray.length-1)) {
        pauseSong();
        playPause.classList.toggle('active');
        nextSong();
      } else {
        if (!repeatDom.className.includes('repeat-one')) {
          nextSong()
        } else {
          timer = 0 
          playSong();
        }
      }
    } 
  }, 1000);
}

const playSong = () => {
  if (document.querySelector('.random').className.includes('selected') && timer == 0 && !repeatDom.className.includes('repeat-one')) {
    playedSongs.length !== songsArray.length && randomSelectSong();
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
  if (document.querySelector('.random').className.includes('selected') && !repeatDom.className.includes('repeat-one')) {
    playedSongs.push(songSelectedIndex);
    if (playedSongs.length !== songsArray.length) {
      randomSelectSong();
    } else {
      playedSongs = [];
      timer = 0;
      if (!repeatDom.className.includes('selected')) {
        songSelectedIndex = 0;
        pauseSong();
        loadSong();
        playPause.classList.toggle('active');
      } else {
        randomSelectSong();
      }
    }
  } else {
    songSelectedIndex = songSelectedIndex < (songsArray.length-1) ? songSelectedIndex+1 : 0;
    songSelected === 0 && pauseSong();
    timer = 0;
    loadSong();
  }
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

document.querySelector('.time').addEventListener('click',e => {
  timeLeft = !timeLeft;
  displayTimes();
});

//change volume with side buttons
const toggleVolume = (index) => {
  switch (index) {
    case 0:
      songSelected.volume < 1 && (songSelected.volume += 0.05)
      break;
    case 1:
      songSelected.volume >= .05 && (songSelected.volume -= 0.05)
      break;
  }
}

volumeButtons[0].addEventListener('click',e => toggleVolume(0));
volumeButtons[1].addEventListener('click',e => toggleVolume(1));

const handleRepeat = e => {
  const classTarget = repeatDom.classList;
  repeatDom.className.includes('repeat-one') ? repeatDom.className = 'repeat' : 
  (repeatDom.className.includes('selected') ? classTarget.add('repeat-one') : classTarget.add('selected'));
}

document.querySelector('.random').addEventListener('click',e => e.target.classList.toggle('selected'));
repeatDom.addEventListener('click',handleRepeat);