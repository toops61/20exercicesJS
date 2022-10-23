/* const getActive = browser.tabs.query({active:true,currentwindow:true});
getActive.then */

/* const createCookie = () => {

        document.cookies.set({
            name: document.querySelector('#cookie-name').value,
            value: document.querySelector('#cookie-value').value
        })

} */

const alertWindow = message => {
    const alert = document.querySelector('.alert-container');
    document.querySelector('.alert-window p').textContent = message;
    alert.classList.remove('hide');
    setTimeout(() => {
        alert.classList.add('hide');
    }, 2000);
}

const checkCookie = () => {
    let cookiesArray = document.cookie.split(';');
    cookiesArray = cookiesArray.map(e => e.trim().split('=')).flat();
    return cookiesArray;
}

const createCookie = () => {
    const cookieName = document.querySelector('#cookie-name').value;
    const cookieValue = document.querySelector('#cookie-value').value;
    if (cookieName !== '' && cookieValue !== '') {
        const array = checkCookie();
        alertWindow(array.includes(cookieName) ? 'Vous avez modifié votre cookie' : 'Vous avez créé un nouveau cookie');
        const expirationDate = new Date(Date.now() + (7 * 24 * 60 * 60000));
        document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate}; Secure;`;
        document.querySelector('form').reset();
    } else {
        alertWindow('Vous devez remplir les champs !');
    }
    
}

const deleteCard = e => {
    if (window.confirm('Voulez vous vraiment effacer ce cookie ?')) {
        let ind = 0;
        const parent = e.srcElement.parentElement;
        const buttonsArray = Array.from(document.querySelectorAll('.cookie-card button'));
        buttonsArray.map((e,index) => {
            e === parent && (ind = index);
        })
        const cookiesArray = checkCookie();
        const name = cookiesArray[ind*2];
        document.cookie = `${name}= ; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.querySelector('.cookie-container').classList.add('hide');
        alertWindow('Cookie effacé');
    }
}

const buildCookie = cookieObject => {
    const cookieCard = document.createElement('div');
    cookieCard.className = 'cookie-card';
    document.querySelector('.cookie-container').append(cookieCard);
    const cookieName = document.createElement('p');
    cookieName.innerHTML = `<span>Name : </span>${cookieObject.name}`;
    cookieCard.append(cookieName);
    const cookieValue = document.createElement('p');
    cookieValue.innerHTML = `<span>Valeur : </span>${cookieObject.value}`;
    cookieCard.append(cookieValue);
    const cookieDelete = document.createElement('button');
    cookieCard.append(cookieDelete);
    const cookieDeleteText = document.createElement('p');
    cookieDeleteText.textContent = 'Supprimer';
    cookieDelete.append(cookieDeleteText);
    cookieDelete.addEventListener('click',e => deleteCard(e));
}

const displayCookies = () => {
    if (document.cookie.length > 0) {
        const cookieContainer = document.querySelector('.cookie-container');
        cookieContainer.classList.remove('hide');
        cookieContainer.replaceChildren();
        const array = checkCookie();
        for (let i = 0; i < array.length/2; i++) {
            const cookie = {
                name: array[i*2],
                value: array[(i*2)+1]
            }
            buildCookie(cookie);
        }
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<p>close</p>';
        cookieContainer.append(closeButton);
        closeButton.addEventListener('click',() => cookieContainer.classList.add('hide'));
    } else {
        alertWindow('Il n\'y a pas de cookie');
    }
}

document.querySelector('.create-button').addEventListener('click', createCookie);
document.querySelector('.display-button').addEventListener('click', displayCookies);

const resetInput = e => {
    e.preventDefault();
    e.srcElement.previousElementSibling.value = '';
}

document.querySelectorAll('.reset')[0].addEventListener('click',e => resetInput(e));
document.querySelectorAll('.reset')[1].addEventListener('click',e => resetInput(e));