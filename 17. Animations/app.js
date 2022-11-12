let tapTitleTimeout;
let target = '';

const contactButton = document.querySelector('.contact-button');

const downScreen = () => {
    const scrollHeight = document.querySelector('.top-section').offsetHeight;
    window.scrollTo({top:scrollHeight,behavior: 'smooth'});
}

document.querySelector('.down-button').addEventListener('click',downScreen);

const moveCursor = e => {
    const posX = e.pageX - 7;
    const posY = e.pageY - 7;
    document.querySelector('.custom-cursor').style.transform = `translate(${posX}px,${posY}px)`;
}

document.addEventListener('mousemove',moveCursor);

const titleDiv = document.querySelector('h1');
const subtitleDiv = document.querySelector('.subtitle');

const titleArray = titleDiv.textContent.split('');

const articlesPart2PicturesArray = document.querySelectorAll('.article-part2 .picture-part');

let text;
let id;

const tapTitle = () => {
    duration = (Math.random() + .5) * 500;
    if (text.length === titleArray.length) {
        id = 0;
        text = '';
        duration = 3000;
    } 
    tapTitleTimeout = setTimeout(() => {
        text += titleArray[id];
        titleDiv.textContent = text;
        id++;
        tapTitle();
    }, duration);
}


const initializeTapTitle = () => {
    text = '';
    id = 0;
    titleDiv.textContent = '';
    clearTimeout(tapTitleTimeout);
    tapTitle();
    Array.from(document.querySelectorAll('.article-part2')).map(e => e.classList.remove('appears'));
    subtitleDiv.classList.add('appears');
}

initializeTapTitle();

const rootMargin = innerWidth > 800 ? '-50px' : '0px';

const observer = new IntersectionObserver(entries => {
    entries.map(e => {
        switch (e.target) {
            case titleDiv:
                e.isIntersecting ? initializeTapTitle() : clearTimeout(tapTitleTimeout);
                break;
            case contactButton:
                if (e.isIntersecting) {
                    document.querySelector('.scroll-section').classList.add('appears');
                    observer.unobserve(e.target);
                }
                break;
                case articlesPart2PicturesArray[0]:
                    if (e.isIntersecting) {
                        document.querySelector('.article-part2').classList.add('appears');
                        subtitleDiv.classList.remove('appears');
                }
                break;
            case articlesPart2PicturesArray[1]:
                if (e.isIntersecting) {
                    document.querySelectorAll('.article-part2')[1].classList.add('appears');
                }
                break;
            case articlesPart2PicturesArray[2]:
                if (e.isIntersecting) {
                    document.querySelectorAll('.article-part2')[2].classList.add('appears');
                }
                break;
        }
    })
}, {
    rootMargin: rootMargin
});

target = titleDiv;
observer.observe(target);

observer.observe(contactButton);

for (let i = 0; i < 3; i++) {
    observer.observe(articlesPart2PicturesArray[i]);
}