const responsesCorrection = [3,1,2,1,3];
const responsesArray = [0,0,0,0,0];
const emojis = ["✅", "✨", "👀", "😭", "👎"];

const questionsArray = [
    {
        question: "Qui est sacré Empereur de France le 2 décembre 1804 ?",
        responses: [
            "Clovis",
            "Abraham Lincoln",
            "Napoléon Bonaparte"
        ]
    },
    {
        question: "Quand la déclaration d'indépendance des Etats-Unis a-t-elle été votée ?",
        responses: [
            "4 juillet 1776",
            "18 avril 1856",
            "30 juin 1925"
        ]
    },
    {
        question: "Quand a eu lieu la chute de l'empire romain d'occident ?",
        responses: [
            "15 ap. J-C",
            "476 ap. J-C",
            "740 av. J-C"
        ]
    },
    {
        question: "Quelle est la capitale de la Slovénie ?",
        responses: [
            "Ljubljana",
            "Belgrade",
            "Bratislava"
        ]
    },
    {
        question: "Combien d'habitants compte l'Irlande en 2020 ?",
        responses: [
            "1,365 M",
            "21 M",
            "4,9 M"
        ]
    }
]

const cardsBuilder = () => {
    questionsArray.map((e,index) => {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        document.querySelector('.questions-container').append(questionContainer);
        const question = document.createElement('h3');
        question.textContent = e.question;
        questionContainer.append(question);
        const responseContainer = document.createElement('fieldset');
        responseContainer.className = 'response-container';
        questionContainer.append(responseContainer);
        for (let i = 0; i < 3; i++) {
            const response = document.createElement('div');
            response.className = 'single-response';
            responseContainer.append(response);
            response.innerHTML += `<input type="radio" name="response${index+1}" id="response${index+1}check${i+1}" /><label for="response${index+1}check${i+1}">${e.responses[i]}</label>`;
            document.querySelector(`#response${index+1}check${i+1}`).addEventListener('change',function () {
                this.checked && responsesArray.splice(index,1,(i+1));
            })
        }
    })
}

cardsBuilder();

const responseDisplay = total => {
    !document.querySelector('button p').textContent.includes(emojis[0]) && (document.querySelector('button p').textContent += emojis[0]);
    const footer = document.querySelector('footer');
    footer.replaceChildren();
    const commentaire = document.createElement('p');
    commentaire.className = 'comment';
    footer.append(commentaire);
    const note = document.createElement('p');
    note.className = 'note';
    footer.append(note);
    const conclusion = document.createElement('p');
    conclusion.className = 'conclusion';
    footer.append(conclusion);
    note.innerHTML = `Score : <span>${total} / 5</span>`;
    switch (total) {
        case 0:
            commentaire.textContent = 'Vous avez totalement raté !';
            break;
            case 1:
            commentaire.textContent = 'Pas terrible du tout.';
            break;
        case 2:
            commentaire.textContent = 'Encore un petit effort !';
            break;
        case 3:
            commentaire.textContent = 'Pas trop mal...';
            break;
        case 4:
            commentaire.textContent = 'Bien ! Une seule faute, vous pouvez faire encore mieux.';
            break;
        case 5:
            commentaire.textContent = 'Wow !! Parfait... Maîtrise totale';
            break;
      }
    total < 5 && (conclusion.textContent = 'Vous pouvez retenter votre chance');
}

const checkResponses = () => {
    let total = 0;
    if (responsesArray.every(e => e != 0)) {
        responsesArray.map((e,index) => {
            e == responsesCorrection[index] && total++;
            document.querySelectorAll('.question-container')[index].className = e == responsesCorrection[index] ? 'question-container good' : 'question-container false';
            responseDisplay(total);
        })
    } else {
        document.querySelector('footer p').textContent = 'Attention, vous devez répondre à toutes les questions';
    }
}

document.querySelector('button').addEventListener('click',checkResponses)