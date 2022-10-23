const apiKey = 'faca82f7062c34e7ff76ac86506ada5b';
const lat = 45.771952;
const long = 4.890167;

/* const meteoCall = () => {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=minutely&appid=${apiKey}`)
    .then(result => result.json())
    .then(data => sessionStorage.setItem('APIresult',JSON.stringify(data)))
    .catch(error => console.error(error));
} */

let arrayHours = [];
let arrayDays = [];

async function meteoCall() {
    document.querySelector('.loader').classList.remove('hide');
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=minutely&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const json = await response.json();
        sessionStorage.setItem('APIresult',JSON.stringify(json));
        fillIcon(json);
        fillCurrentInfos(json);
        arrayHours = fillHoursTemp(json);
        arrayDays = fillDaysTemp(json);
        hoursTempDisplay();
        document.querySelector('.loader').classList.add('hide');
    } catch (error) {
        console.error(error);
    }
}

const convertDt = dateTime => new Date(dateTime*1000).getHours()+'h';

const fillIcon = result => {
    const icon =  result.current.weather[0].icon;
    const day = icon.includes('d') ? 'jour' : 'nuit';
    document.querySelector('.logo img').src = `./ressources/${day}/${icon}.svg`;
}

const fillCurrentInfos = result => {
    document.querySelector('.temp').textContent = Math.round(result.current.temp - 273.15) + '°';
}

const fillHoursTemp = result => {
    const arrayTemp = [];
    for (let i = 1; i < 8; i++) {
        arrayTemp.push({
            hour: convertDt(result.hourly[i*3].dt),
            temperature: Math.round(result.hourly[i*3].temp - 273.15) + '°'
        })
    }
    return arrayTemp;
}

const fillDaysTemp = result => {
    const arrayTemp = [];
    const arrayDays = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    for (let i = 1; i < 8; i++) {
        const day = new Date(result.daily[i].dt*1000).getDay();
        arrayTemp.push({
            day: arrayDays[day],
            temperature: Math.round(result.daily[i].temp.day - 273.15) + '°'
        })
    }
    return arrayTemp;
}

const fillTab = () => {

}

const buttonDays = document.querySelector('.days-button');
const buttonHours = document.querySelector('.hours-button');

const hoursTempDisplay = () => {
    if (!buttonHours.className.includes('select')) {
        buttonHours.classList.add('select');
        buttonDays.classList.remove('select');
        for (let i = 0; i < 7; i++) {
            document.querySelectorAll('.temp-container h4')[i].textContent = arrayHours[i].hour;
            document.querySelectorAll('.temp-container p')[i].textContent = arrayHours[i].temperature;
        }
    }
}

const daysTempDisplay = () => {
    if (!buttonDays.className.includes('select')) {
        buttonDays.classList.add('select');
        buttonHours.classList.remove('select');
        for (let i = 0; i < 7; i++) {
            document.querySelectorAll('.temp-container h4')[i].textContent = arrayDays[i].day;
            document.querySelectorAll('.temp-container p')[i].textContent = arrayDays[i].temperature;
        }
    }
}

buttonHours.addEventListener('click',hoursTempDisplay);
buttonDays.addEventListener('click',daysTempDisplay);

const result = JSON.parse(sessionStorage.getItem('APIresult'));

if (result && new Date(result.current.dt*1000).getDate() === new Date().getDate() && new Date(result.current.dt*1000).getHours() === new Date().getHours()) {
    fillIcon(result);
    fillCurrentInfos(result);
    arrayHours = fillHoursTemp(result);
    arrayDays = fillDaysTemp(result);
    hoursTempDisplay();
} else {
    meteoCall();
}

/* const testAPIGouv = () => {
    //fetch('https://geo.api.gouv.fr/communes?codePostal=69100')
    fetch('https://geo.api.gouv.fr/departements/69/communes')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
} */