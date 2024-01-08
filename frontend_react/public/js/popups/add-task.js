const URL_CARDS = 'http://127.0.0.1:8000/cards/';
const addTaskBtn = document.querySelector('.add-task');
const taskPopup = document.querySelector('.edit-task').closest('.popup');

function closeBtnTaskHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.add('hidden');
    this.removeEventListener('click', closeBtnTaskHandler);
}

function saveBtnHandler (evt) {
    evt.preventDefault();
    const date = new Date();

    const savedData = window.location.search;
    const userData = new URLSearchParams(savedData);

    const projId = userData.get('id');

    let object = {
        card_id: Date.parse(date),
        category: 'planned',
        task: document.querySelector('#theme-task-input').value,
        description: document.querySelector('#about-task-input').value,
        project: projId // передать актуальный id
    };

    const data = JSON.stringify(object);
    sendDataCard(URL_CARDS, data);
    taskPopup.classList.add('hidden');
    document.location.reload();
}

function addTaskBtnHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.remove('hidden');

    const closeBtn = taskPopup.querySelector('.close-btn');
    const saveBtn = taskPopup.querySelector('.save-button');
    taskPopup.querySelector('.delete-button').classList.add('hidden');

    saveBtn.addEventListener('click', saveBtnHandler);
    closeBtn.addEventListener('click', closeBtnTaskHandler);
}

function sendDataCard(url, data) {
    fetch(url, 
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
    },
    )
    .then((response) => {
        if(!response.ok){
            console.log('Ошибка в POST запросе при создании карточки');
        }
    })
    .catch(() => {
        console.log('Ошибка в POST запросе при создании карточки, но не в URL');
    })
}

addTaskBtn.addEventListener('click', addTaskBtnHandler);