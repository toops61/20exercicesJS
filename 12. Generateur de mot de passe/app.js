const passwordObject = {
    lowercase: false,
    uppercase: false,
    integers: false,
    specials: false
}

const copyAlert = () => {
    console.log('copié');
}

const copyPassword = () => {
    const text = document.querySelector('.result p').textContent;
    navigator.clipboard.writeText(text).then(() => copyAlert(),error => console.log(error));
}

document.querySelector('.copy-icon').addEventListener('click',copyPassword);

const passwordLength = e => {
    const length = e.target.value;
    document.querySelectorAll('label span')[0].textContent = length;
}

document.querySelector('#length').addEventListener('input',e => passwordLength(e));

const passwordParams = (e,index) => {
    const key = Object.keys(passwordObject)[index];
    passwordObject[key] = !passwordObject[key];
    console.log(e.target.checked);
}

Array.from(document.querySelectorAll('.input-container input')).map((el,index) => {
    el.addEventListener('input',e => passwordParams(e,index));
})

let codeArray = new Uint32Array(10);
self.crypto.getRandomValues(codeArray);
codeArray.map(e => {
    console.log(e);
})