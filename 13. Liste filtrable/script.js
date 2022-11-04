async function getUsers() {
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
    array.map((user,index) => {
        buildLine(user,index);
    })
}

const filterSearch = e => {
    const usersArray = Array.from(document.querySelectorAll('.user-row'));
    if (usersArray.length) {
        const wordsArray = e.target.value.split(' ');
        const first = wordsArray.join('').toLowerCase();
        const reverse = wordsArray.reverse().join('').toLowerCase();
        usersArray.map(el => {
            let name = el.firstChild.children[2].textContent;
            name = name.split(' ').join('').toLowerCase();
            name.includes(first) || name.includes(reverse) ? el.classList.remove('hide') : el.classList.add('hide');
        })
    }
}

document.querySelector('input').addEventListener('input',e => filterSearch(e));