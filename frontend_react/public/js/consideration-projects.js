import { URL_STUDENT_PROJECTS, URL_PROFILE } from "./modules/urls.js";
import { getData } from "./modules/requests.js";
import { getTokens, projectClickHandler } from "./modules/utility.js";

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

const tokens = getTokens();

getData(URL_STUDENT_PROJECTS, tokens.access, onSuccessGetProjects);

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
document.addEventListener('click', (evt) => {
    const projCards = document.querySelectorAll('.project-card');

    let cardElem;
    projCards.forEach((projCard) => {
        if (projCard.contains(evt.target)) {
            cardElem = projCard;
        }
    });

    if (cardElem) {
        const transferData = projectClickHandler(
            cardElem.querySelector('.proj-id').textContent,
            cardElem.querySelector('.title-card').textContent,
            cardElem.querySelector('#teacher-name').textContent,
            cardElem.querySelector('#sphere').textContent,
            cardElem.querySelector('.card-description').textContent,
            cardElem.querySelector('#state').textContent,
            cardElem.querySelector('#student-id').textContent
        );

        transferData();
    }
})

// Логика для вкладок header
getData(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const fi = document.querySelector('#fi');

    fi.textContent = `${data.last_name} ${data.first_name}`;
}