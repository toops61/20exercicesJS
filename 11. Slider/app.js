let centerIndex = 1;
let imagesArray = [];

const topSection = document.querySelector('.top-section');
const pictureContainersArray = document.querySelectorAll('.picture-container');

const displayAlert = text => {
    document.querySelector('.alert-window').classList.remove('hide');
    document.querySelector('.alert-box h1').textContent = text;
    setTimeout(() => {
        document.querySelector('.alert-window').classList.add('hide');
    }, 2000);
}

const toTheLeft = () => {
    if (topSection.className === 'top-section') {
        topSection.classList.add('left-anim');
        centerIndex = centerIndex > 2 ? 1 : (centerIndex+1);
        document.querySelectorAll('.picture-container h3')[2].textContent = `slide${centerIndex}`;
        setTimeout(() => {
            imagesArray.push(imagesArray.shift());
            fillImages(imagesArray);
            topSection.classList.remove('left-anim');
        }, 1000);
    }
}

const toTheRight = () => {
    if (topSection.className === 'top-section') {
        topSection.classList.add('right-anim');
        centerIndex = centerIndex > 1 ? (centerIndex-1) : 3;
        document.querySelectorAll('.picture-container h3')[0].textContent = `slide${centerIndex}`;
        setTimeout(() => {
            imagesArray.unshift(imagesArray.pop());
            fillImages(imagesArray);
            topSection.classList.remove('right-anim');
        }, 1000);
    }
}

const constructImagesContainers = () => {
    for (let i = 0; i < 3; i++) {
        const pictureContainers = document.createElement('div');
        pictureContainers.className = i == 1 ? 'picture-container visible' : 'picture-container';
        topSection.append(pictureContainers);
        const pictureBox = document.createElement('div');
        pictureBox.className = 'picture-box';
        pictureContainers.append(pictureBox);
        const imgDiv = document.createElement('img');
        imgDiv.setAttribute('alt','cat');
        pictureBox.append(imgDiv);
        const h3Div = document.createElement('h3');
        h3Div.textContent = `slide${i+1}`;
        pictureContainers.append(h3Div);
        pDiv = document.createElement('p');
        pictureContainers.append(pDiv);
    }
    fillImages(imagesArray);
}

document.querySelector('.left').addEventListener('click',toTheLeft);
document.querySelector('.right').addEventListener('click',toTheRight);

const fillImages = array => {
    for (let i = 0; i < 3; i++) {
        document.querySelectorAll('.picture-box img')[i].setAttribute('src',array[i].url);
        document.querySelectorAll('.picture-container p')[i].textContent = array[i].id;
        document.querySelectorAll('.picture-container h3')[i].textContent = `slide${centerIndex}`;
    }
}

const getImages = () => {
    fetch('https://api.thecatapi.com/v1/images/search?limit=3')
    .then(response => response.json())
    .then(data => {
        imagesArray = [...data];
        topSection.children.length === 0 ? constructImagesContainers() : fillImages(imagesArray);
    })
    .catch(error => {
        console.log(error);
        displayAlert('Nous n\'avons pas pu récupérer les photos, réessayez.');
    });
}

getImages();

document.querySelector('.button-change').addEventListener('click',getImages);