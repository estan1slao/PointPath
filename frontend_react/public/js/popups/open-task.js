const taskPopupName = taskPopup.querySelector('.popup-text');
const taskPopupAbout = taskPopup.querySelector('#about-task-input');
const taskPopupCategory = taskPopup.querySelector('#category-input');
const commentTemplate = document.querySelector('#comment-template').content.querySelector('.comment');
const commentsField = document.querySelector('.comments-field');

const URL_GETCOMMENTS = 'http://127.0.0.1:8000/comments/';
const URL_CREATECOMMENT = 'http://127.0.0.1:8000/comments/create/';
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
    const commentInput = document.querySelector('#comment-input');
    const taskID = evt.currentTarget.closest('.popup').id;
    const obj = {
        task: taskPopupName.value,
        description: taskPopupAbout.value,
        category: taskPopupCategory.value
    };

    const FULL_URL_OPENCARD = `${URL_OPENCARD}${projId}/${taskID}/`;

    sendNewTaskInfo(FULL_URL_OPENCARD, tokens.access, obj);

    if (commentInput.value !== '') {
        createComment(URL_CREATECOMMENT, commentInput.value, taskID, tokens.access);
    }

    taskPopup.classList.add('hidden');
    // window.location.reload();
}

function deleteBtnTaskHandler (evt) {
    evt.preventDefault();

    const FULL_URL_OPENCARD = `${URL_OPENCARD}${projId}/${evt.currentTarget.closest('.popup').id}/`;

    deleteTask(FULL_URL_OPENCARD, tokens.access);

    taskPopup.classList.add('hidden');
    window.location.reload();
}

function drawComments (data) {
    data.forEach((item) => {
        const comment = commentTemplate.cloneNode(true);
        console.log(comment);
        comment.querySelector('.author').textContent = `${item.last_name_proponent} ${item.first_name_proponent} ${item.patronymic_proponent}`;
        comment.querySelector('.comment-value').textContent = `${item.content}`;
        console.log(comment);
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
            getComments(URL_GETCOMMENTS + taskID + '/', drawComments, tokens.access);
        }
    })

    closeBtn.addEventListener('click', closeBtnTaskHandler);
}

function getComments (url, onSuccess, token) {
    fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
        else {
            console.log('Ошибка в URL');
        }
    })
    .then((data) => {
        onSuccess(data);
    }) 
    .catch(() => {
        console.log('Ошибка где-то, но не в URL');
    })
}

function createComment (url, comment, taskID, token) {
    fetch(url, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }, 
        body: JSON.stringify({
            card_id: +taskID,
            content: comment
        }) 
    })
}

// comments/<int:card>/   получить все комменты у карточки [GET] + token(вроде)
// comments/create/   создать коммент [POST] + token

// #Comments
//     path('comments/<int:card>/', views.getComments, name='get-comments'),
//     path('comments/create/', CreateCommentsView.as_view(), name='create-comments'),
//     # {
//     #     "card_id": null,
//     #     "content": ""
//     # }