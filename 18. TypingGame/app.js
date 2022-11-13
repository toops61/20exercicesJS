const APIEndpoint = "http://api.quotable.io/random";

let typingSentence = '';
let typingTimer = 60;
let totalValidate = 0;
let score = 0;
let timerInterval;

let typingScoresArray = localStorage.timersMemory ? JSON.parse(localStorage.getItem('timersMemory')) : [];

const timerDiv = document.querySelector('.timer');
const validButton = document.querySelector('.valid-button');
const falseButton = document.querySelectorAll('.valid-button')[1];
const typingSentenceDiv = document.querySelector('.typing-sentence');
const endGameDiv = document.querySelector('.end-game');
const inputArea = document.querySelector('textarea');
const alertWindow = document.querySelector('.alert-window');

timerDiv.textContent = `Temps ${typingTimer}`;

const getSentence = async () => {
    try {
        const response = await fetch(APIEndpoint);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        typingSentence = data.content;
        typingSentenceDiv.textContent = typingSentence;
    } catch (error) {
        console.log(`Il y a eu une erreur, rechargez : ${err.message} (${err.name})`);
    }
}

getSentence();

const handleTimer = () => {
    timerInterval = setInterval(() => {
        typingTimer > 0 ? typingTimer-- : endGame();
        timerDiv.textContent = `Temps ${typingTimer}`;
    }, 1000);
}

const validSentence = valid => {
    if (valid) {
        validButton.classList.remove('hide');
        falseButton.classList.add('hide');
        score = inputArea.value.length + totalValidate;
    } else {
        validButton.classList.add('hide');
        falseButton.classList.remove('hide');
        score > 0 && score--;
    }
    document.querySelector('.score').textContent = `Score : ${score}`;
}

//compare typed sentence with suggested one
const compareSentences = e => {
    if (typingTimer > 0) {
        const typed = e.target.value;
        let valid = false;
        if (typed.length === 1) {
            valid = typed === typingSentence[0] ? true : false;
            typingTimer === 60 && handleTimer();
        } else if (typed.length > 1) {
            valid = typingSentence.includes(typed) ? true : false;
        }
        //typed != from '' => validSentence() and colorParts()
        if (typed) {
            validSentence(valid)
        } else {
            validButton.classList.add('hide');
            falseButton.classList.add('hide');
            document.querySelector('.score').textContent = `Score : ${totalValidate}`;
        }
        if (typed === typingSentence) {
            totalValidate += typed.length;
            getSentence();
            inputArea.value = '';
        }
    }
}

inputArea.addEventListener('input',compareSentences);

const sortScores = () => typingScoresArray.sort((a,b) => b.score-a.score);

//display best scores in alert window
const displayScores = () => {
    const bestTimersDiv = document.querySelector('.best-timers');
    bestTimersDiv.replaceChildren();
    typingScoresArray.map(e => {
        const scoreDisplayed = document.createElement('p');
        scoreDisplayed.textContent = `${e.date} : ${e.score}`;
        bestTimersDiv.append(scoreDisplayed);
    })
}

//add score to best scores array and sort
const handleScores = () => {
    typingScoresArray.length > 9 && typingScoresArray.pop();
    typingScoresArray.push({score: score, date: new Date().toLocaleDateString()});
    sortScores();
    displayScores();
    localStorage.setItem('timersMemory',JSON.stringify(typingScoresArray));
}

const endGame = () => {
    clearInterval(timerInterval);
    alertWindow.classList.remove('hide');
    endGameDiv.textContent = `${score >= typingScoresArray[0].score ? 'Meilleur' : 'Fin du'} chrono : vous avez tapé ${score} lettres`;
    inputArea.value = '';
    totalValidate = 0;
    typingSentenceDiv.textContent = '';
    handleScores();
}

const resetGame = () => {
    endGameDiv.textContent = '';
    typingTimer = 60;
    totalValidate = 0;
    score = 0;
    clearInterval(timerInterval);
    timerDiv.textContent = `Temps ${typingTimer}`;
    document.querySelector('.score').textContent = `Score : ${score}`;
    validButton.classList.add('hide');
    falseButton.classList.add('hide');
    inputArea.value = '';
    getSentence();
}

const closeAlert = () => {
    alertWindow.classList.add('hide');
    resetGame();
}

document.querySelector('.reset-button').addEventListener('click',resetGame);
document.querySelector('.close-button').addEventListener('click',closeAlert);