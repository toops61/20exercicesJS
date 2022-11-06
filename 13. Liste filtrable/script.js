let users = [];
let usersArray;
let searchInput = '';

//fetch call to API
const getUsers = async () => {
    try {
        const result = await fetch('https://randomuser.me/api/?nat=fr&results=100');
        if (!result.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        };
        const data = await result.json();
        data.results.length && buildUserLines(data.results);
    } catch (error) {
        console.log(error);
    }
}

getUsers();

//dispatch green lines on peer
const greenLines = () => {
    const arrayVisibles = usersArray.filter(e => !e.className.includes('hide'));
    arrayVisibles.map((e,index) => {
        index%2 === 0 ? e.classList.add('green') : e.classList.remove('green');
    })
    document.querySelector('.total-users span').textContent = arrayVisibles.length;
}

//construct lines from users array from API fetch call
const buildLine = (user,index) => {
    const rowDiv = document.createElement('tr');
    rowDiv.className = (index%2 === 0) ? 'user-row green' : 'user-row';
    document.querySelector('tbody').append(rowDiv);
    //first column
    const nameDiv = document.createElement('td');
    nameDiv.className = 'name-container';
    rowDiv.append(nameDiv);
    //profil picture
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo-profil';
    nameDiv.append(photoDiv);
    const image = document.createElement('img');
    image.setAttribute('src',user.picture.thumbnail);
    image.setAttribute('alt','profil');
    photoDiv.append(image);
    //bigger profil picture
    const bigPhotoDiv = document.createElement('div');
    bigPhotoDiv.className = 'bigger-picture';
    nameDiv.append(bigPhotoDiv);
    const image2 = document.createElement('img');
    image2.setAttribute('src',user.picture.medium);
    image2.setAttribute('alt','profil bigger');
    bigPhotoDiv.append(image2);
        //name
        const name = document.createElement('p');
        name.textContent = `${user.name.last} ${user.name.first}`;
        nameDiv.append(name);
    //second column    
    const mailDiv = document.createElement('td');
    rowDiv.append(mailDiv);
    const mail = document.createElement('p');
    mail.textContent = user.email;
    mailDiv.append(mail);
    //third column
    const phoneDiv = document.createElement('td');
    rowDiv.append(phoneDiv);
    const phone = document.createElement('p');
    phone.textContent = user.phone;
    phoneDiv.append(phone);
}

const buildUserLines = array => {
    document.querySelector('tbody').replaceChildren();
    array.sort((a,b) => {
        return (a.name.last < b.name.last) ? -1 : 1;
    })
    users = [...array];
    array.map((user,index) => {
        buildLine(user,index);
    })
    usersArray = Array.from(document.querySelectorAll('.user-row'));
    document.querySelector('.total-users span').textContent = array.length;
}

//hide rows depending on gender
const manWomanCheck = id => {
    if (id === "all-gender") {
        usersArray.forEach(el => el.classList.remove('woman-man-hide'));
    } else {
        const gender = id === "woman" ? "female" : "male";
        usersArray.map((el,index) => {
            users[index].gender === gender ? el.classList.remove('woman-man-hide') : el.classList.add('woman-man-hide');
        })
    }
    greenLines();
}

//addEventListener to 
for (let i = 0; i < 3; i++) {
    document.querySelectorAll('input[name="man-woman"]')[i].addEventListener('input',e => manWomanCheck(e.target.id));
}

//filter depending on input and/or category selected
const filterSearch = () => {
    const category = Array.from(document.querySelectorAll('.search-category input')).find(element => element.checked).id;
    if (usersArray.length) {
        const wordsArray = searchInput.split(' ');
        const first = wordsArray.join('').toLowerCase();
        const reverse = wordsArray.reverse().join('').toLowerCase();
        usersArray.map((el,index) => {
            let name;
            switch (category) {
                case 'name-category' :
                    name = el.firstChild.children[2].textContent;
                    name = name.split(' ').join('').toLowerCase();
                    break;
                case 'username-category' :
                    name = users[index].login.username.toLowerCase();
                    break;
                case 'email-category' :
                    name = el.childNodes[1].textContent.toLowerCase();
                    break;
                case 'city-category' :
                    name = users[index].location.city.toLowerCase();
                    break;
                case 'state-category' :
                    name = users[index].location.state.toLowerCase();
                    break;
                case 'country-category' :
                    name = users[index].location.country.toLowerCase();
                    break;
            }
            name.includes(first) || name.includes(reverse) ? el.classList.remove('hide') : el.classList.add('hide');
        })
        greenLines();
    }
}

//filll text and pictures content when order category is changed
const orderColumn = () => {
    usersArray.map((el,index) => {
        document.querySelectorAll('.photo-profil img')[index].setAttribute('src',users[index].picture.thumbnail);
        document.querySelectorAll('.bigger-picture img')[index].setAttribute('src',users[index].picture.medium);
        el.firstChild.childNodes[2].textContent = users[index].name.last + ' ' + users[index].name.first;
        el.childNodes[1].firstChild.textContent = users[index].email;
    })
}

//sort users array depending on order category selected
const orderUsersArray = () => {
    const category = Array.from(document.querySelectorAll('.search-category input')).find(element => element.checked).id;
    const thArray = Array.from(document.querySelectorAll('th'));
    thArray[0].className.includes('selected') && users.sort((a,b) => {
        return (a.name.last < b.name.last) ? -1 : 1;
    });
    thArray[1].className.includes('selected') && users.sort((a,b) => {
        return (a.email < b.email) ? -1 : 1;
    });
    thArray[2].className.includes('selected') && users.sort((a,b) => {
        switch (category) {
            case "city-category":
                return (a.location.city < b.location.city) ? -1 : 1;
            case "state-category":
                return (a.location.state < b.location.state) ? -1 : 1;
            case "country-category":
                return (a.location.country < b.location.country) ? -1 : 1;
            case "username-category":
                return (a.login.username < b.login.username) ? -1 : 1;
            default:
                return (a.phone < b.phone) ? -1 : 1;
        }
    });
    !thArray.some(e => e.className.includes('rotate')) && (users = users.reverse());
    orderColumn();
    filterSearch();
    const ind = Array.from(document.querySelectorAll('input[name="man-woman"]')).find(e => e.checked).id;
    manWomanCheck(ind);
}

//add or rotate arrow on ordered column
const orderColumnPicto = id => {
    const thArray = Array.from(document.querySelectorAll('th'));
    thArray.map((el,index) => {
        el.classList.remove('selected');
        id !== index && el.classList.remove('rotate');
    });
    thArray[id].classList.add('selected');
    thArray[id].classList.toggle('rotate');
    orderUsersArray();
}

//change third column users's infos displayed
const changeLastColumn = () => {
    const category = Array.from(document.querySelectorAll('.search-category input')).find(element => element.checked).id;
    switch (category) {
        case "city-category":
            document.querySelectorAll('th h3')[2].textContent = "Ville";
            usersArray.map((e,index) => e.childNodes[2].firstChild.textContent = users[index].location.city);
            break;
        case "state-category":
            document.querySelectorAll('th h3')[2].textContent = "Département";
            usersArray.map((e,index) => e.childNodes[2].firstChild.textContent = users[index].location.state);
            break;
        case "country-category":
            document.querySelectorAll('th h3')[2].textContent = "Pays";
            usersArray.map((e,index) => e.childNodes[2].firstChild.textContent = users[index].location.country);
            break;
        case "username-category":
            document.querySelectorAll('th h3')[2].textContent = "Pseudo";
            usersArray.map((e,index) => e.childNodes[2].firstChild.textContent = users[index].login.username);
            break;
        default:
            document.querySelectorAll('th h3')[2].textContent = "Téléphone";
            usersArray.map((e,index) => e.childNodes[2].firstChild.textContent = users[index].phone);
            break;
    }
}

//fill searchInput from search bar input value then filter
const fillSearch = e => {
    searchInput = e.target.value;
    filterSearch();
}

const categoryChangedFunction = () => {
    filterSearch();
    changeLastColumn();
}

document.querySelector('.search-bar input').addEventListener('input',e => fillSearch(e));
Array.from(document.querySelectorAll('.search-category input')).map(e => e.addEventListener('input',categoryChangedFunction));
Array.from(document.querySelectorAll('th')).map((el,index) => el.addEventListener('click',e => orderColumnPicto(index)));