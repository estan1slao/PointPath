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

    let object = {
        id_card: Date.parse(date),
        type: 'planned',
        theme: document.querySelector('#theme-task-input').value,
        about: document.querySelector('#about-task-input').value,
        id_project: 1
    };

    const data = JSON.stringify(object);
    console.log(data);
    sendDataCard(URL_CARDS, data);

    taskPopup.classList.add('hidden');
}

function addTaskBtnHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.remove('hidden');

    const closeBtn = taskPopup.querySelector('.close-btn');
    const saveBtn = taskPopup.querySelector('.save-button');

    console.log(saveBtn);

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
        if(response.ok){
            console.log(response);
        }
        else {
            console.log('Ошибка 4');
        }
    })
    .catch(() => {
        console.log('Ошибка 3');
    })
}

addTaskBtn.addEventListener('click', addTaskBtnHandler);