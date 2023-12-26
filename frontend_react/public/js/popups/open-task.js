const URL_SENDCOMMENTS = 'http://127.0.0.1:8000/comments/';
const URL_OPENCARD = 'http://127.0.0.1:8000/card/';

let dataOfCards;
getDataCardsInfo(URL_GETCARDS);

setTimeout(() => {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach((task) => {
        task.addEventListener('click', taskClickHandler);
    }) 
}, 1000); //чтобы успели прийти данные с сервера - если знаешь как лучше сделать - скажи

const taskPopupName = taskPopup.querySelector('.popup-text');
const taskPopupAbout = taskPopup.querySelector('#about-task-input');
const taskPopupCategory = taskPopup.querySelector('#category-input');

function sendNewTaskInfo(url, data) {
    fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

function getDataCardsInfo (url) {
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
            console.log('Ошибка');
        }
    })
    .then((result) => {
        dataOfCards = result;
    })
}

function closeBtnTaskHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.add('hidden');

    this.removeEventListener('click', closeBtnTaskHandler);
}

function sendIDInfo(url, data) {
    fetch (url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: data
    })
}

function saveBtnTaskHandler (evt) {
    evt.preventDefault();

    const obj = {
        task: taskPopupName.value,
        description: taskPopupAbout.value,
        category: taskPopupCategory.value
    };

    sendNewTaskInfo(URL_OPENCARD + evt.currentTarget.closest('.popup').id, obj);
    taskPopup.classList.add('hidden');
    location.reload();
}


function taskClickHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.remove('hidden');

    const taskID = evt.currentTarget.id;
    const closeBtn = taskPopup.querySelector('.close-btn');
    const saveBtn = taskPopup.querySelector('.save-button');

    dataOfCards.forEach((cardInfo) => {
        if (cardInfo.card_id == taskID) {
            taskPopupName.value = cardInfo.task;
            taskPopupAbout.value = cardInfo.description;
            taskPopupCategory.value = cardInfo.category;
            taskPopup.id = taskID;

            saveBtn.addEventListener('click', saveBtnTaskHandler);
            // sendIDInfo(URL_SENDCOMMENTS, taskID);
        }
    })
    
    closeBtn.addEventListener('click', closeBtnTaskHandler);
}