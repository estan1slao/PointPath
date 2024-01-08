import {URL_CREATE_COMMENT, URL_GET_CARDS, URL_GET_COMMENTS, URL_OPEN_CARD} from "../modules/urls.js"
import { getTokens } from "../modules/utility.js";
import { editData, deleteTask, getData, getListOfData, createComment } from "../modules/requests.js";

const taskPopupName = taskPopup.querySelector('.popup-text');
const taskPopupAbout = taskPopup.querySelector('#about-task-input');
const taskPopupCategory = taskPopup.querySelector('#category-input');
const commentTemplate = document.querySelector('#comment-template').content.querySelector('.comment');
const commentsField = document.querySelector('.comments-field');

const savedData = window.location.search;
const userData = new URLSearchParams(savedData);
const projId = userData.get('id');

const tokens = getTokens();
let dataOfCards;

getListOfData(URL_GET_CARDS + `${projId}/`, (result) => {
    dataOfCards = result;
})

setTimeout(() => {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach((task) => {
        task.addEventListener('click', taskClickHandler);
    }) 
}, 1000);

function closeBtnTaskHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.add('hidden');
    window.location.reload();
    this.removeEventListener('click', closeBtnTaskHandler);
}

function saveBtnTaskHandler (evt) {
    evt.preventDefault();
    const commentInput = document.querySelector('#comment-input');
    const taskID = evt.currentTarget.closest('.popup').id;
    const obj = {
        task: taskPopupName.value,
        description: taskPopupAbout.value,
        category: taskPopupCategory.value
    };
    const FULL_URL_OPENCARD = `${URL_OPEN_CARD}${projId}/${taskID}/`;
    editData(FULL_URL_OPENCARD, tokens.access, JSON.stringify(obj), console.log);

    if (commentInput.value !== '') {
        createComment(URL_CREATE_COMMENT, commentInput.value, taskID, tokens.access);
    }

    taskPopup.classList.add('hidden');
    window.location.reload();
}

function deleteBtnTaskHandler (evt) {
    evt.preventDefault();
    const FULL_URL_OPENCARD = `${URL_OPEN_CARD}${projId}/${evt.currentTarget.closest('.popup').id}/`;
    deleteTask(FULL_URL_OPENCARD, tokens.access);
    taskPopup.classList.add('hidden');
    window.location.reload();
}

function drawComments (data) {
    data.forEach((item) => {
        const comment = commentTemplate.cloneNode(true);
        comment.querySelector('.author').textContent = `${item.last_name_proponent} ${item.first_name_proponent} ${item.patronymic_proponent}`;
        comment.querySelector('.comment-value').textContent = `${item.content}`;
        commentsField.appendChild(comment);
    })
}

function taskClickHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.remove('hidden');

    const taskID = evt.currentTarget.id;
    const closeBtn = taskPopup.querySelector('.close-btn');
    const saveBtn = taskPopup.querySelector('.save-button');
    const deleteTask = taskPopup.querySelector('.delete-button');
    deleteTask.classList.remove('hidden');

    dataOfCards.forEach((cardInfo) => {
        if (cardInfo.card_id == taskID) {
            taskPopupName.value = cardInfo.task;
            taskPopupAbout.value = cardInfo.description;
            taskPopupCategory.value = cardInfo.category;
            taskPopup.id = taskID;

            saveBtn.addEventListener('click', saveBtnTaskHandler);
            deleteTask.addEventListener('click', deleteBtnTaskHandler);
            getData(URL_GET_COMMENTS + taskID + '/', tokens.access, drawComments);
        }
    })

    closeBtn.addEventListener('click', closeBtnTaskHandler);
}