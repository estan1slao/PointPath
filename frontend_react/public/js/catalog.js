const URL_PROJECTS = 'http://127.0.0.1:8000/projects/student-get-projects/';

const nxtBtn = document.querySelector('.nxt-btn');
const preBtn = document.querySelector('.pre-btn');
const more = document.querySelector('.more');
const cardsContainer = document.querySelector('.catalog-container');

const cardTemplate = document.querySelector('#project-card-template')
    .content
    .querySelector('.project-card');

const moreTemplate = document.querySelector('#more-template')
    .content
    .querySelector('.more-cycle');

const catalog = document.querySelector('.catalog-container');

function getDataProjects (url, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
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

getDataProjects(URL_PROJECTS, onSuccessGetProjects);

function onSuccessGetProjects (projects) {
    projects.forEach(project => {
        const card = cardTemplate.cloneNode(true);

        card.querySelector('.title-card').textContent = project.topic;
        card.querySelector('#teacher-name').textContent = 
            `${project.last_name_proponent} ${project.first_name_proponent} ${project.patronymic_proponent}`;
        card.querySelector('#sphere').textContent = project.field_of_activity;
        card.querySelector('.card-description').textContent = project.about;
        card.querySelector('.proj-id').textContent = project.id;

        catalog.append(card);
    });


    // карусель
    const pagesCount = Math.ceil(projects.length / 3);

    if (pagesCount !== 0) {
        more.classList.remove('hidden');
        if (pagesCount > 1) {
            nxtBtn.classList.remove('hidden');
        }
    }

    for (let i = 0; i < pagesCount; i++) {
        const newCircle = moreTemplate.cloneNode(true);

        if (i === 0) {
            newCircle.classList.add('more-cycle__active');
        }

        more.append(newCircle);
    }

    const moreCircles = more.querySelectorAll('.more-cycle')
    let currentPage = 0;

    nxtBtn.addEventListener('click', () => {
        cardsContainer.scrollLeft += 1707;
        if (currentPage < pagesCount-1) {
            currentPage++;
            moreCircles[currentPage].classList.add('more-cycle__active');
            moreCircles[currentPage-1].classList.remove('more-cycle__active');
        }
        if (currentPage > 0) {
            preBtn.classList.remove('hidden');
        }
        if (currentPage === pagesCount-1) {
            nxtBtn.classList.add('hidden');
        }
    })
    
    preBtn.addEventListener('click', () => {
        cardsContainer.scrollLeft -= 1707;
        if (currentPage > 0) {
            currentPage--;
            moreCircles[currentPage].classList.add('more-cycle__active');
            moreCircles[currentPage+1].classList.remove('more-cycle__active');
        }
        if (currentPage < pagesCount-1) {
            nxtBtn.classList.remove('hidden');
        }
        if (currentPage === 0) {
            preBtn.classList.add('hidden');
        }
    })
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
            about: cardElem.querySelector('.card-description').textContent
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
            console.log('Ошибка 3');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('Ошибка 4');
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

const tokens = {};
getTokens();

getDataLogin(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const proposeProjectTab = document.querySelector('#propose-project');
    const fi = document.querySelector('#fi');

    if (data.role === "ученик") { //впринципе проверять не нужно, потому что учитель никогда в католог попасть не сможет
        proposeProjectTab.classList.add('hidden');
    }
    
    fi.textContent = `${data.last_name} ${data.first_name}`;
}
