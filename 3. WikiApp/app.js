let searchInput = '';

const input = document.querySelector('input');
input.addEventListener('input',e => searchInput = e.target.value);

const resetInput = () => {input.value = ''}
document.querySelector('.reset').addEventListener('click',resetInput);

const fillResult = (result) => {
    const array = [...result];
    document.querySelector('.result-container').replaceChildren();
    array.length > 0 && array.map(e => {
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        document.querySelector('.result-container').append(resultCard);
        const titleLink = document.createElement('a');
        titleLink.setAttribute('href', `https://en.wikipedia.org/?curid=${e.pageid}`);
        titleLink.setAttribute('target', `_blank`);
        titleLink.setAttribute('rel', `noopener`);
        resultCard.append(titleLink);
        const title = document.createElement('h2');
        title.textContent = e.title;
        titleLink.append(title);
        const resume = document.createElement('p');
        resume.innerHTML = e.snippet;
        resultCard.append(resume);
    })
}

//vers1 promises with then
/* const searchWord = () => {
    if (searchInput !== '') {
        document.querySelector('.loader').classList.remove('hide');
        fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`)
        .then(response => response.json())
        .then(
            data => {
                document.querySelector('.loader').classList.add('hide');
                searchInput = '';
                return fillResult(data.query.search);
            }
        )
        .catch(e => console.log(e));
    } else {
        document.querySelector('.error-window').classList.remove('hide');
        setTimeout(() => {
            document.querySelector('.error-window').classList.add('hide');
        }, 2000);
    }
} */

//vers2 async await
async function searchWord () {
    if (searchInput !== '') {
        document.querySelector('.loader').classList.remove('hide');
        try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const json = await response.json();
            document.querySelector('.loader').classList.add('hide');
            searchInput = '';
            document.querySelector('input').value = '';
            fillResult(json.query.search);
        }
        catch(error) {
            console.error(error);
        }
    } else {
        document.querySelector('.error-window').classList.remove('hide');
        setTimeout(() => {
            document.querySelector('.error-window').classList.add('hide');
        }, 2000);
    }
}

document.querySelector('button').addEventListener('click',searchWord);

document.addEventListener('keydown',e => {e.key === 'Enter' && searchWord()});