const taskPopupName = taskPopup.querySelector('.popup-text');
const taskPopupAbout = taskPopup.querySelector('#about-task-input');
const taskPopupCategory = taskPopup.querySelector('#category-input');

let dataOfCards;

// console.log(tokens);

getDataCardsInfo(URL_GETCARDS);

setTimeout(() => {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach((task) => {
        task.addEventListener('click', taskClickHandler);
    }) 
}, 1000); //чтобы успели прийти данные с сервера - если знаешь как лучше сделать - скажи

// function fillCardInfo () {
//     const tasks = document.querySelectorAll('.task');
//     tasks.forEach((task) => {
//         task.addEventListener('click', taskClickHandler);
//     }) 
// }

function sendNewTaskInfo(url, token, data) {
    fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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

function deleteTask(url, token) {
    fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

function saveBtnTaskHandler (evt) {
    evt.preventDefault();

    const obj = {
        task: taskPopupName.value,
        description: taskPopupAbout.value,
        category: taskPopupCategory.value
    };

    const FULL_URL_OPENCARD = `${URL_OPENCARD}${projId}/${evt.currentTarget.closest('.popup').id}/`;

    sendNewTaskInfo(FULL_URL_OPENCARD, tokens.access, obj);
    taskPopup.classList.add('hidden');
    window.location.reload();
}

function deleteBtnTaskHandler (evt) {
    evt.preventDefault();

    const FULL_URL_OPENCARD = `${URL_OPENCARD}${projId}/${evt.currentTarget.closest('.popup').id}/`;

    deleteTask(FULL_URL_OPENCARD, tokens.access);

    taskPopup.classList.add('hidden');
    window.location.reload();
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
            // sendIDInfo(URL_SENDCOMMENTS, taskID);
        }
    })

    closeBtn.addEventListener('click', closeBtnTaskHandler);
}