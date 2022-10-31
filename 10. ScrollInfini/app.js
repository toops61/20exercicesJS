let arrayPhotos = localStorage.arrayPhotos ? JSON.parse(localStorage.getItem('arrayPhotos')) : [];
let page = 1;
let query = '';
let target = '';

const searchQuery = () => {
    localStorage.setItem('arrayPhotos',JSON.stringify([]));
    document.querySelector('.photos-container').replaceChildren();
    query = document.querySelector('input').value;
    query ? callApiPhotos(query) : displayMessage('votre recherche est vide...');
}

document.querySelector('button').addEventListener('click',searchQuery);
    
/* const buildSquares = () => {
    const randomFunc = max => Math.floor(Math.random() * max);
    document.querySelector('.photos-container');
    for (let i = 0; i < 30; i++) {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        document.querySelector('.photos-container').append(photoCard);
        let [r,g,b] = ['r','g','b'].map(e => randomFunc(256));
        photoCard.style.backgroundColor = `rgb(${r},${g},${b})`;
        if (i === 20) {
            target = photoCard;
            observer.observe(target);
        }
    }
} */

const observer = new IntersectionObserver(entries => {
    entries.map(e => {
        //when card is visible load new page of pictures and skip previous target
        if (e.isIntersecting) {
            page++;
            observer.unobserve(e.target);
            callApiPhotos(query);
        }
    })
    
});

const buildCards = () => {
    arrayPhotos.map((e,index) => {
        const imageURL = e.urls.small;
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        document.querySelector('.photos-container').append(photoCard);
        const imagePhoto = document.createElement('img');
        imagePhoto.setAttribute('src',imageURL);
        imagePhoto.setAttribute('alt',e.alt_description);
        photoCard.append(imagePhoto);
        if (index === 25) {
            target = photoCard;
            observer.observe(target);
        }
    })
}

displayMessage = text => {
    const textDiv = document.querySelector('.error-message');
    textDiv.textContent = text;
    textDiv.classList.remove('hide-message');
    setTimeout(() => {
        textDiv.classList.add('hide-message');
    }, 2000);
}

const callApiPhotos = query => {
    fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${access}&page=${page}&per_page=30`)
    .then(response => response.json())
    .then(data => {
        const array = localStorage.arrayPhotos ? JSON.parse(localStorage.getItem('arrayPhotos')) : [];
        data.results.map(e => array.push(e));
        localStorage.setItem('arrayPhotos',JSON.stringify(array));
        arrayPhotos = [...data.results];
        arrayPhotos.length > 0 ? buildCards() : displayMessage('Aucun résultat pour cette recherche, essayez autre chose.');
    })
    .catch(error => {
        console.log(error);
        displayMessage('Il y a eu une erreur, réessayez.');
    });
}

//arrow page top
document.querySelector('.arrow').addEventListener('click', e => window.scrollTo(0,0));

const checkScroll = e => {
    document.querySelector('.arrow').className = scrollY > 320 ? 'arrow' : 'arrow hide';
}

document.addEventListener('scroll', e => checkScroll(e));