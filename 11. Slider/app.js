let centerIndex = 1;
let imagesArray = [];

const pictureContainer = document.querySelector('.top-section');
const pictureContainersArray = document.querySelectorAll('.picture-container');

const toTheLeft = () => {
    if (pictureContainer.className === 'top-section') {
        pictureContainer.classList.add('left-anim');
        centerIndex = centerIndex > 2 ? 1 : (centerIndex+1);
        document.querySelectorAll('.picture-container h3')[2].textContent = `slide${centerIndex}`;
        setTimeout(() => {
            imagesArray.push(imagesArray.shift());
            fillImages(imagesArray);
            pictureContainer.classList.remove('left-anim');
        }, 1000);
    }
}

const toTheRight = () => {
    if (pictureContainer.className === 'top-section') {
        pictureContainer.classList.add('right-anim');
        centerIndex = centerIndex > 1 ? (centerIndex-1) : 3;
        document.querySelectorAll('.picture-container h3')[0].textContent = `slide${centerIndex}`;
        setTimeout(() => {
            imagesArray.unshift(imagesArray.pop());
            fillImages(imagesArray);
            document.querySelector('.top-section').classList.remove('right-anim');
        }, 1000);
    }
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
        imagesArray = [...data]
        fillImages(imagesArray);
    })
    .catch(error => console.log(error));
}

getImages();