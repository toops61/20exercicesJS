const validFunc = index => document.querySelectorAll('.input-container')[index].classList.add('valid');
const invalidFunc = index => document.querySelectorAll('.input-container')[index].classList.remove('valid');



const rejectPseudo = e => {
    const regExpPseudo = new RegExp('[=;,`()§≠…∞ø«¡¶{}“º%¬®†°‡∂ﬁƒ¬‹≈©◊*#—<>≤≥]');
    const value = e.target.value;
    if (!regExpPseudo.test(value) && value.length > 2) {
        validFunc(0);
    } else {
        console.log('caractères non autorisés');
        invalidFunc(0);
    }
}

const rejectEmail = e => {
    const regExpEmail = new RegExp('([/=;,`:éàèîôû$&"()§!≠…∞€ø«¡¶{}“º%µ¬®†°π‡∂ﬁƒ¬‹≈©◊£*#ë—<>≤≥])');
    const value = e.target.value;
    if (!regExpEmail.test(value) && value.includes('@') && value.includes('.')) {
        validFunc(1);
    } else {
        console.log('caractères non autorisés');
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
        
    }
}
const confirmPassword = e => {
    const value = e.target.value;
    console.log(value);
    if (value === document.querySelectorAll('input')[2].value) {
        validFunc(3);
        
    } else {
        console.log('pas pareil');
        invalidFunc(3);
    }
}

const checkAllValid = e => {
    e.preventDefault();
    if (Array.from(document.querySelectorAll('.input-container')).every(e => e.className.includes('valid'))) {
        console.log('Bravooo');
    } else {
        alert('Pas valide !')
    }
}

document.querySelectorAll('input')[0].addEventListener('change',e => rejectPseudo(e));
document.querySelectorAll('input')[1].addEventListener('change',e => rejectEmail(e));
document.querySelectorAll('input')[2].addEventListener('change',e => rejectPassword(e));
document.querySelectorAll('input')[3].addEventListener('change',e => confirmPassword(e));
document.querySelector('button').addEventListener('click',e => checkAllValid(e));