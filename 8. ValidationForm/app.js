const inputContainer = document.querySelectorAll('.input-container');

const validFunc = index => {
    inputContainer[index].classList.add('valid');
    inputContainer[index].classList.remove('invalid');
} 
const invalidFunc = index => {
    inputContainer[index].classList.remove('valid');
    inputContainer[index].classList.add('invalid');
}

const alertWindow = (texte,indice) => {
    document.querySelector('.alert-window').classList.remove('hide');
    document.querySelector('.alert-container h2').textContent = texte;
    indice === 1 ? document.querySelector('.alert-container').classList.add('alert') : document.querySelector('.alert-container').classList.remove('alert');
    setTimeout(() => {
        document.querySelector('.alert-window').classList.add('hide');
    }, 2000);
}

const passwordLevel = number => {
    //console.log(number);
    const levelArray = document.querySelectorAll('.level');
    document.querySelector('.password-level').classList.remove('hide');
    number > 1 ? levelArray[1].classList.remove('hide-level') : levelArray[1].classList.add('hide-level');
    number == 3 ? levelArray[2].classList.remove('hide-level') : levelArray[2].classList.add('hide-level');
}

const rejectPseudo = e => {
    const regExpPseudo = new RegExp('[=;,`()§≠…∞ø«¡¶{}“º%¬®†°‡∂ﬁƒ¬‹≈©◊*#—<>≤≥]');
    const value = e.target.value;
    if (!regExpPseudo.test(value) && value.length > 2) {
        validFunc(0);
    } else {
        invalidFunc(0);
    }
}

const rejectEmail = e => {
    const regExpEmail = new RegExp('([/=;,`:éàèîôû$&"()§!≠…∞€ø«¡¶{}“º%µ¬®†°π‡∂ﬁƒ¬‹≈©◊£*#ë—<>≤≥])');
    const value = e.target.value;
    if (!regExpEmail.test(value) && value.includes('@') && value.includes('.')) {
        validFunc(1);
    } else {
        invalidFunc(1);
    }
}

const rejectPassword = e => {
    const regExpPassword = new RegExp('^(?=.*[0-9])(?=.*[a-zÞ-öø-ÿ])(?=.*[A-ZÀ-ÖØ-Ý])(?=.*[^0-9a-zÞ-öø-ÿA-ZÀ-ÖØ-Ý ]).{6,60}$');
    const value = e.target.value;
    if (regExpPassword.test(value)) {
        validFunc(2);
    } else {
        invalidFunc(2);
        document.querySelector('.password-level').classList.add('hide');
    }
}

const testPassword = e => {
    const value = e.target.value;
    const totalNumbers = value.length - value.replace(/[0-9]/g,'').length;
    const totalMaj = value.length - value.replace(/[A-Z]/g,'').length;
    const totalSpecials = value.length - value.replace(/[^0-9a-zÞ-öø-ÿA-ZÀ-ÖØ-Ý]/g,'').length;
    if (value.length > 12 && totalNumbers > 2 && totalMaj > 2 && totalSpecials > 2) {
        passwordLevel(3);
    } else if (value.length > 8 && totalNumbers > 1 && totalMaj > 1 && totalSpecials > 1) {
        passwordLevel(2);
    } else if (value.length > 5 && totalNumbers > 0 && totalMaj > 0 && totalSpecials > 0) {
        passwordLevel(1);
    }
}

const confirmPassword = e => {
    const value = e.target.value;
    if (value === document.querySelectorAll('input')[2].value) {
        validFunc(3);
    } else {
        invalidFunc(3);
    }
}

const checkAllValid = e => {
    e.preventDefault();
    if (Array.from(inputContainer).every(e => e.className === 'input-container valid')) {
        alertWindow('Félicitations, votre compte est créé',0);
        document.querySelector('.alert-container p').textContent = document.querySelectorAll('.level')[1].className.includes('hide-level') ? 'vous pouvez renforcer votre mot de passe' : '';
    } else if (Array.from(document.querySelectorAll('input')).some(e => e.value === '')) {
        alertWindow('Attention, vous devez remplir tous les champs !',1);
    } else {
        alertWindow('Attention, les champs ne sont pas correctement remplis !',1);
    }
}

document.querySelectorAll('input')[0].addEventListener('change',e => rejectPseudo(e));
document.querySelectorAll('input')[1].addEventListener('change',e => rejectEmail(e));
document.querySelectorAll('input')[2].addEventListener('change',e => rejectPassword(e));
document.querySelectorAll('input')[2].addEventListener('input',e => testPassword(e));
document.querySelectorAll('input')[3].addEventListener('change',e => confirmPassword(e));
document.querySelector('button').addEventListener('click',e => checkAllValid(e));