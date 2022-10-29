let cardDivArray;

let arrayImages = [];

let totalShots = 0;

const winningAlert = () => {
    setTimeout(() => {
        alert('BRAVO !!! c\'est gagné');
        resetAll();
    }, 1000);
}

const flipCard = (e,index) => {
    const flippedCards = Array.from(cardDivArray).filter(el => el.className.includes('flip') && !el.className.includes('same'));
    if (flippedCards.length < 2) {
        cardDivArray[index].classList.add('flip');
        flippedCards.push(cardDivArray[index]);
        if (flippedCards.length === 2) {
            totalShots++;
            document.querySelector('p').textContent = `Nombre de coups : ${totalShots}`;
            if (flippedCards[0].childNodes[1].childNodes[0].src === flippedCards[1].childNodes[1].childNodes[0].src) {
                flippedCards[0].classList.add('same');
                flippedCards[1].classList.add('same');
                Array.from(cardDivArray).every(element => element.className.includes('same')) && winningAlert();
            }
        }
        setTimeout(() => {
            !cardDivArray[index].className.includes('same') && cardDivArray[index].classList.remove('flip');
        }, 1000);
    }
}

const resetAll = () => {
    totalShots = 0;
    document.querySelector('p').textContent = `Nombre de coups : ${totalShots}`;
    Array.from(cardDivArray).map(e => e.className = 'card');
    setTimeout(() => {
        randomizeImages();
    }, 1000);
}

document.querySelector('button').addEventListener('click',resetAll);

const displayImages = array => {
    Array.from(document.querySelectorAll('.front img')).map((e,index) => {
        e.setAttribute('src',`./ressources/${array[index]}.svg`);
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
        const index = Math.floor(Math.random() * 6);
        newArrayImages.filter(e => e === arrayImages[index]).length < 2 && newArrayImages.push(arrayImages[index]);
    } while (newArrayImages.length < arrayImages.length*2);
    buildCards(newArrayImages);
}

fetch('./ressources')
.then(response => response.text())
.then(data => {
    arrayImages = data.split('ressources/').filter(e => e.includes('.svg'));
    arrayImages = arrayImages.map(e => e.split('.svg')[0]);
    arrayImages = arrayImages.filter(e => e !== 'question');
    randomizeImages();
})
.catch(err => console.log(err));