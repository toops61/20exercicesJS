const passwordObject = {
    lowercase: false,
    uppercase: false,
    integers: false,
    specials: false,
    length: 4
}

const copyAlert = () => {
    document.querySelector('.clipboard').classList.remove('hide');
    setTimeout(() => {
        document.querySelector('.clipboard').classList.add('hide');
    }, 2000);
}

const alertWindow = text => {
    document.querySelector('.alert-box h1').textContent = text;
    document.querySelector('.alert-window').classList.remove('hide');
    setTimeout(() => {
        document.querySelector('.alert-window').classList.add('hide');
    }, 2000);
}

const copyPassword = () => {
    if (document.querySelector('.result p').textContent) {
        const text = document.querySelector('.result p').textContent;
        navigator.clipboard.writeText(text).then(() => copyAlert(),error => console.log(error));
    }
}

document.querySelector('.copy-icon').addEventListener('click',copyPassword);

const passwordLength = e => {
    const length = e.target.value;
    document.querySelectorAll('label span')[0].textContent = length;
    passwordObject.length = length;
}

document.querySelector('#length').addEventListener('input',e => passwordLength(e));

const passwordParams = (e,index) => {
    const key = Object.keys(passwordObject)[index];
    passwordObject[key] = !passwordObject[key];
}

const inputsCheckedArray = Array.from(document.querySelectorAll('.input-container input'));

inputsCheckedArray.map((el,index) => {
    el.addEventListener('input',e => passwordParams(e,index));
})

const generateRandomNumbers = lettersNumbersString => {
    let codeArray = new Uint32Array(passwordObject.length);
    self.crypto.getRandomValues(codeArray);
    codeArray = codeArray.map(e => {
        const newNumber = e / 4294967296;
        const index = Math.floor(newNumber * lettersNumbersString.length);
        return index;
    })
    return codeArray;
}

const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseLetters = lowercaseLetters.toUpperCase();
const allIntegers = '0123456789';
const specialsCaracters = '#@&"\'(§!)-$€*£?.:=+/=<>';

const concatenateCaracters = (array,string) => {
    let password = '';
    array.map(e => {
        password += string[e];
    })
    return password;
}

const generatePassword = (e) => {
    e.preventDefault();
    if (inputsCheckedArray.some(e => e.checked)) {     
        const lettersNumbersString = (passwordObject.lowercase ? lowercaseLetters : '') + (passwordObject.uppercase ? uppercaseLetters : '') + (passwordObject.integers ? allIntegers : '') + (passwordObject.specials ? specialsCaracters : '');
        const array = generateRandomNumbers(lettersNumbersString);
        const password =concatenateCaracters(array,lettersNumbersString);
        document.querySelector('.result p').textContent = password;
    } else {
        alertWindow('Vous devez sélectionner au moins un paramètre');
    }
}

document.querySelector('.button-generate').addEventListener('click',e => generatePassword(e));