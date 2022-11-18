const resetAll = () => {
    h1Dom.textContent = '0';
    operationDom.textContent = '';
    number = '';
    operationArray = [];
}

const correctTouch = () => {
    //console.log('correct');
    if (number.length) {
        number = number.slice(0,(number.length-1));
        h1Dom.textContent = number.length ? number : 0;
    } else if (operationArray.length && !number.length) {
        operationArray.pop();
        operationArray.length && operationArray[operationArray.length-1]/1 && (number = operationArray[operationArray.length - 1]);
        operationArray.pop();
        operationArray.length ? operationArray.map(el => operationDom.textContent += el) : operationDom.textContent = '';
        h1Dom.textContent = number;
        //number.length && correctTouch();
    }
}

//first do * and / operations
const multDivFirst = () => {
    operationArray.map((e,index) => {
        if (e === 'x') {
            const multiplication = operationArray[index-1]*operationArray[index+1];
            operationArray.splice([index-1],3,multiplication);
        }
        if (e === '/') {
            let division = operationArray[index-1]/operationArray[index+1];
            !Number.isInteger(division) && (division = division.toFixed(6));
            operationArray.splice([index-1],3,division);
        }
    })
}

const getResult = () => {
    operationArray.push(number);
    operationDom.textContent += number;
    number = '';
    //execute * and / if it still is some
    do {
        multDivFirst();
    } while (operationArray.some(e => (e === '*' || e === '/')));
    //console.log(operationArray);
    let result = operationArray[0]/1;
    operationArray.length > 1 && operationArray.map((el,index) => {
        if (index > 0 && index/1) {
            switch (operationArray[index - 1]) {
                case '+':
                    result += (el/1);
                    break;
                case '-':
                    result -= el;
                    break;
            }
            return result
        }
    })
    h1Dom.textContent = `= ${result}`;
    operationArray = [];
    number = result;
}

let number = '';
let operation = '';
let operationArray = [];

const handleTouch = (e,index) => {
    //console.log(index);
    if (e.target.className.includes('digits') || e.target.parentElement.className.includes('digits')) {
        h1Dom.textContent.includes('=') && (number = '');
        h1Dom.textContent.includes('=') && (operationDom.textContent = '');
        number += (number === '' && e.target.innerText === '0') ? '' : e.target.innerText;
        number && (h1Dom.textContent = number);
    } else if ((e.target.className.includes('operator') || e.target.parentElement.className.includes('operator')) && number) {
        if (!number) {
            operationArray.pop();
            operationArray.push(e.target.innerText);
        } else {
            operationArray.push(number);
            operationArray.push(e.target.innerText);
            number = '';
        }
    } else if (index === 16 && !number.includes('.')) {
        number += number ? e.target.innerText : '0.';
        h1Dom.textContent = number;
    } else if (index === 1 && !h1Dom.textContent.includes('=') && (number.length || operationArray.length)) {
        correctTouch();
    }
    index === 0 && resetAll();
    if (operationArray.length) {
        operationDom.textContent = '';
        operationArray.map(el => operationDom.textContent += el);
    } 
    index === 17 && number && getResult();
}

const touchArrayDom = document.querySelectorAll('.touch');
const digitsArrayDom = document.querySelectorAll('.digits');
const h1Dom = document.querySelector('h1');
const operationDom = document.querySelector('.operation');

Array.from(touchArrayDom).map((el,index) => el.addEventListener('click',e => handleTouch(e,index)));