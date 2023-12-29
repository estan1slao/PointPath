const URL_STUDENT_PROJECTS = "http://127.0.0.1:8000/projects/teacher-viewing-proposed-projects/";

const cardTemplate = document.querySelector('#project-card-template')
    .content
    .querySelector('.project-card');

const catalog = document.querySelector('.catalog');

function getDataProjects (url, token, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Ошибка 1');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('Ошибка 2');
    });
}

const tokens = {};
getTokens();

getDataProjects(URL_STUDENT_PROJECTS, tokens.access, onSuccessGetProjects);

function onSuccessGetProjects (projects) {
    projects.forEach(project => {
        const card = cardTemplate.cloneNode(true);

        card.querySelector('.title-card').textContent = project.topic;
        card.querySelector('#teacher-name').textContent = 
            `${project.last_name_proponent} ${project.first_name_proponent} ${project.patronymic_proponent}`;
        card.querySelector('#sphere').textContent = project.field_of_activity;
        card.querySelector('.card-description').textContent = project.about;
        card.querySelector('.proj-id').textContent = project.id;
        card.querySelector('#student-id').textContent = project.student;
        card.querySelector('#state').textContent = project.state;

        catalog.append(card);
    });
}

// Сохранение данных, чтобы забрать их на другую страницу

let projInfo;

document.addEventListener('click', (evt) => {
    const projCards = document.querySelectorAll('.project-card');

    let cardElem;
    projCards.forEach((projCard) => {
        if (projCard.contains(evt.target)) {
            cardElem = projCard;
        }
    });

    if (cardElem) {
        projInfo = {
            id: cardElem.querySelector('.proj-id').textContent,
            topic: cardElem.querySelector('.title-card').textContent,
            user: cardElem.querySelector('#teacher-name').textContent,
            sphere: cardElem.querySelector('#sphere').textContent,
            about: cardElem.querySelector('.card-description').textContent,
            studentId: cardElem.querySelector('#student-id').textContent,
            state: cardElem.querySelector('#state').textContent
        }
        console.log(projInfo);

        const savedData = new URLSearchParams(projInfo).toString();
        window.location.href = `./project-page.html?${savedData}`;
    }
})

// Логика для вкладок header
const URL_PROFILE = 'http://127.0.0.1:8000/profile/';

function getDataLogin (url, token, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Ошибка 1');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('Ошибка 2');
    });
}

function getTokens () {
    const cookies = document.cookie.split('; ');

    cookies.forEach((token) => {
        const [name, value] = token.split('=');
        if (name === 'access') {
            tokens.access = value;
        } else if (name === 'refresh') {
            tokens.refresh = value;
        }
    })
}

getDataLogin(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const fi = document.querySelector('#fi');

    fi.textContent = `${data.last_name} ${data.first_name}`;
}
