const objectColor = {
    orientation: 0,
    color_one: '#444',
    color_two: '#000'
}

const hexToRgb = hex => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(r, g, b) {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return r+g+b;
}

const colorOneCont = document.querySelector('#color_one');
const colorTwoCont = document.querySelector('#color_two');
const orientationDiv = document.querySelector('#orientation');

const applyColor = id => {
    id.includes('orientation') && (document.querySelector('.label-orientation p').textContent = `${objectColor.orientation}°`);
    if (id.includes('color_one')) {
        colorOneCont.labels[0].children[0].textContent = objectColor.color_one;
        colorOneCont.labels[0].children[0].style.color = hexToRgb(objectColor.color_one) > 410 ? 'black' : 'white';
    }
    if (id.includes('color_two')) {
        colorTwoCont.labels[0].children[0].textContent = objectColor.color_two;
        colorTwoCont.labels[0].children[0].style.color = hexToRgb(objectColor.color_two) > 410 ? 'black' : 'white';
    } 
}

const getParams = e => {
    const id = e.srcElement.id;
    objectColor[id] = e.target.value;
    document.querySelector('main').style.background = `linear-gradient(${objectColor.orientation}deg,${objectColor.color_one}, ${objectColor.color_two})`;
    applyColor(id);
}

[colorOneCont,colorTwoCont,orientationDiv].map(el => el.addEventListener('input',e => getParams(e)));

const componentToHex = x => {
    const hex = x.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const randomFunc = max => Math.floor(Math.random() * max);

const randomColor = () => {
    let [r,g,b] = ['r','g','b'].map(e => randomFunc(256));
    colorOneCont.labels[0].children[0].style.color = r+g+b > 410 ? 'black' : 'white';
    objectColor.color_one = rgbToHex(r,g,b);
    applyColor('color_one');
    colorOneCont.value = objectColor.color_one;
    
    [r,g,b] = ['r','g','b'].map(e => randomFunc(256));
    colorTwoCont.labels[0].children[0].style.color = r+g+b > 410 ? 'black' : 'white';
    objectColor.color_two = rgbToHex(r,g,b);
    applyColor('color_two');
    colorTwoCont.value = objectColor.color_two;

    objectColor.orientation = Math.floor(Math.random() * 361);
    applyColor('orientation');
    orientationDiv.value = objectColor.orientation;

    document.querySelector('main').style.background = `linear-gradient(${objectColor.orientation}deg,${objectColor.color_one}, ${objectColor.color_two})`;
}

const logColor = () => console.log(`linear-gradient(${objectColor.orientation}deg,${objectColor.color_one}, ${objectColor.color_two})`);

document.querySelectorAll('button')[1].addEventListener('click',randomColor);
document.querySelectorAll('button')[0].addEventListener('click',logColor);