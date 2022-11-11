let player1Turn = true;

let player1Name = 'joueur1';
let player2Name = 'joueur2';

const winArray = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const resetButton = document.querySelector('.reset');
const inputsNames = document.querySelectorAll('.input-names');
const playerTurn = document.querySelector('.player-turn');

const submitName = id => {
    const value = inputsNames[id].value;
    id === 0 ? value && (player1Name = value) : value &&(player2Name = value);
    toggleNames();
}

Array.from(document.querySelectorAll('.arrow')).map((el,index) => el.addEventListener('click',e => submitName(index)));

const playCase = document.querySelectorAll('.case');

const toggleNames = () => {
    playerTurn.textContent = `Au tour de ${player1Turn ? player1Name : player2Name}`;
}

const displayWinner = playerName => {
    document.querySelector('.winner').textContent = `BRAVO !! Le gagnant est ${playerName}`;
    playerTurn.classList.add('hide');
}

const checkWinner = () => {
    let winner = false;
    const caseContent = id => playCase[id].firstChild.textContent;
    winArray.map(e => {
        if (caseContent(e[0]) === caseContent(e[1]) && caseContent(e[1]) === caseContent(e[2]) && caseContent(e[0]) === caseContent(e[2]) && caseContent(e[0])) {
            winner = true;
        };
    })
    return winner;
}

const playerArrayDisplay = id => {
    playCase[id].firstChild.textContent = player1Turn ? 'X' : 'O';
}

const toggleChecked = (e,id) => {
    if (!playCase[id].className.includes('played')) {
        playCase[id].classList.add('played');
        playerArrayDisplay(id);
        const winner = checkWinner();
        winner && displayWinner(player1Turn ? player1Name : player2Name);
        player1Turn = !player1Turn;
        toggleNames();
    }
}

Array.from(playCase).map((el,index) => el.addEventListener('click',e => toggleChecked(e,index)));

const resetAll = () => {
    resetButton.classList.add('selected');
    player1Name = 'joueur1';
    player2Name = 'joueur2';
    playCase.forEach(e => {
        e.firstChild.textContent = '';
        e.classList.remove('played');
    });
    player1Turn = true;
    toggleNames();
    document.querySelector('.winner').textContent = '';
    playerTurn.classList.remove('hide');
    inputsNames[0].value = '';
    inputsNames[1].value = '';
    resetButton.className.includes('selected') && setTimeout(() => {
        resetButton.classList.remove('selected');
    }, 1000);
}

resetButton.addEventListener('click',resetAll);