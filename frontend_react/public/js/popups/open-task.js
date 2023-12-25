import { getDataCards } from "../trajectory.js";

const URL_GETCARDS = 'http://127.0.0.1:8000/getcards/';
const URL_CARDS = 'http://127.0.0.1:8000/cards/';

const tasks = document.querySelectorAll('.task');
const taskPopup = document.querySelector('.edit-task').closest('.popup');
const taskPopupName = taskPopup.querySelector('.popup-text');
const taskPopupAbout = taskPopup.querySelector('.about-task-input');
const taskPopupCategory = taskPopup.querySelector('.category-input');

function sendNewTaskInfo(url, data, key) {
    fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            key: data
        }),
    })
    .then((response) => {
        if (response.ok) {
            console.log(response);
        }
        else {
            console.log('Ошибка в POST запросе на отправку новой информации');
        }
    })
    .catch(() => {
        console.log('Ошибка в POST запросе на отправку новой информации, но не в URL');
    })
}


function taskPopupNameHandler (evt) {
    sendNewTaskInfo(URL_OPENCARDS + taskID, evt.currentTarget.value, task);
}

function taskPopupDescHandler (evt) {
    sendNewTaskInfo(URL_OPENCARDS + taskID, evt.currentTarget.value, description);
}

function taskClickHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.remove('hidden');

    const taskID = evt.currentTarget.id;
    const dataOfCards = getDataCards(URL_CARDS);

    dataOfCards.forEach((cardInfo) => {
        if (cardInfo.card_id == taskID) {
            taskPopupName.value = cardInfo.task;
            taskPopupAbout.value = cardInfo.description;
            taskPopupCategory.value = cardInfo.category;
        }
    })

    taskPopupName.addEventListener('change', taskPopupNameHandler);
    taskPopupName.addEventListener('change', taskPopupDescHandler);
}

tasks.forEach((task) => {
    task.addEventListener('click', taskClickHandler);
}) 