let cardDivArray;

let timerInterval = null;

let arrayImages = [];

let totalShots = 0;
let timer = 0;

let arrayTimers = localStorage.timersMemory ? JSON.parse(localStorage.getItem('timersMemory')) : [];


const displayBestTimers = () => {
    document.querySelector('.best-timers').replaceChildren();
    arrayTimers.map(e => {
        const minutes = Math.floor(e.time / 60);
        const seconds = e.time % 60;
        document.querySelector('.best-timers').innerHTML += `<div class="timer-classment"><div class="present-timer hide">-></div><p>${e.date} ${minutes}:${seconds < 10 ? 0 : ''}${seconds}</p></div>`;
    })
    const indexArray = [];
    arrayTimers.find((e,index) => {
        if (e.time === timer) {
            indexArray.push(index);
        }
    })
    document.querySelectorAll('.present-timer')[indexArray[0]].classList.remove('hide');
}

const sortTimers = () => {
    arrayTimers.sort((a,b) => a.time-b.time);
}

const convertTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.querySelector('.chrono-container p').textContent = `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
}

const timerDisplay = () => {
    timerInterval = setInterval(() => {
        timer++;
        convertTimer();
    }, 1000);
}

const resetAllTimers = () => {
    if (window.confirm('Voulez-vous vraiment effacer tous les scores ?')) {
        localStorage.setItem('timersMemory',JSON.stringify([]));
        arrayTimers = [];
        closeAlert();
        resetAll();
    }
}

const closeAlert = () => {
    document.querySelector('.alert-window').classList.add('hide');
}

document.querySelector('.alert-container .close').addEventListener('click',closeAlert);
document.querySelector('.alert-container .reset-all').addEventListener('click',resetAllTimers);

const alertWindow = message => {
    document.querySelector('.alert-window h2').textContent = message;
    document.querySelector('.alert-window').classList.remove('hide');
}

const winningAlert = () => {
    setTimeout(() => {
        arrayTimers.push({time: timer, date: new Date().toLocaleDateString()});
        sortTimers();
        alertWindow(`BRAVO !!! c\'est gagné.${arrayTimers[0].time === timer ? ' Record battu, vous avez le meilleur temps !!' : ''}`);
        displayBestTimers();
        localStorage.setItem('timersMemory',JSON.stringify(arrayTimers));
        resetAll();
    }, 500);
}

const flipCard = (e,index) => {
    if (!timerInterval) {
        const array = JSON.parse(localStorage.getItem('timersMemory'));
        const max = array.length >= 9 ? 9 : array.length;
        arrayTimers = [];
        for (let i = 0; i < max; i++) {
            arrayTimers.push(array[i]);
        }
        timerDisplay();
    }
    const flippedCards = Array.from(cardDivArray).filter(el => el.className.includes('flip') && !el.className.includes('same'));
    if (flippedCards.length < 2 && !cardDivArray[index].className.includes('flip')) {
        cardDivArray[index].classList.add('flip');
        flippedCards.push(cardDivArray[index]);
        if (flippedCards.length === 2) {
            totalShots++;
            document.querySelector('main p').textContent = `Nombre de coups : ${totalShots}`;
            if (flippedCards[0].childNodes[1].childNodes[0].src === flippedCards[1].childNodes[1].childNodes[0].src) {
                flippedCards[0].classList.add('same');
                flippedCards[1].classList.add('same');
                Array.from(cardDivArray).every(element => element.className.includes('same')) && winningAlert();
            } else {
                setTimeout(() => {
                    flippedCards[0].classList.remove('flip');
                    flippedCards[1].classList.remove('flip');
                }, 1000);
            }
        }
    }
}

const resetAll = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timer = 0;
    document.querySelector('.chrono-container p').textContent = '0:00';
    totalShots = 0;
    document.querySelector('main p').textContent = `Nombre de coups : ${totalShots}`;
    Array.from(cardDivArray).map(e => e.className = 'card');
    setTimeout(() => {
        randomizeImages();
    }, 1000);
}

document.querySelector('.reset-button').addEventListener('click',resetAll);

const displayImages = array => {
    Array.from(document.querySelectorAll('.front img')).map((e,index) => {
        e.setAttribute('src',`./ressources/${array[index]}`);
    })
}

const buildCards = array => {
    document.querySelector('.cards-container').replaceChildren();
    array.map(e => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        document.querySelector('.cards-container').append(cardDiv);
        const backDiv = document.createElement('div');
        backDiv.className = 'back';
        backDiv.innerHTML = `<img src="./ressources/question.svg" alt="question">`
        cardDiv.append(backDiv);
        const frontDiv = document.createElement('div');
        frontDiv.className = 'front';
        frontDiv.innerHTML = `<img src="" alt="hidden">`
        cardDiv.append(frontDiv);
    })
    cardDivArray = document.querySelectorAll('.card');
    Array.from(cardDivArray).map((element,index) =>{
        element.addEventListener('click',e => flipCard(e,index));
    })
    displayImages(array);
}

const randomizeImages = () => {
    const newArrayImages = [];
    do {
        const index = Math.floor(Math.random() * arrayImages.length);
        newArrayImages.filter(e => e === arrayImages[index]).length < 2 && newArrayImages.push(arrayImages[index]);
    } while (newArrayImages.length < arrayImages.length*2);
    buildCards(newArrayImages);
}

fetch('./ressources')
.then(response => response.text())
.then(data => {
    arrayImages = data.split('ressources/').filter(e => e.includes('.svg') || e.includes('.png') || e.includes('.jpg') || e.includes('.webp'));
    arrayImages = arrayImages.map(e => {
        e.includes('.webp') && (e = `${e.split('.webp')[0]}.webp`);
        e.includes('.jpg') && (e = `${e.split('.jpg')[0]}.jpg`);
        e.includes('.png') && (e = `${e.split('.png')[0]}.png`);
        e.includes('.svg') && (e = `${e.split('.svg')[0]}.svg`);
        return e;
    });
    arrayImages = arrayImages.filter(e => e !== 'question.svg');
    randomizeImages();
})
.catch(err => console.log(err));