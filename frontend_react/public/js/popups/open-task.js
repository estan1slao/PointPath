const tasks = document.querySelectorAll('.task');
const taskPopup = document.querySelector('.edit-task').closest('.popup');
const taskPopupTheme = taskPopup.querySelector('.popup-text');
const taskPopupAbout = taskPopup.querySelector('.about-task-input');
const taskPopupCategory = taskPopup.querySelector('.category-input');

function sendTaskInfo(url, data) {
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            id: data
        },
    })
    .then((response) => {
        if (response.ok) {
            console.log(response);
        }
        else {
            console.log('Ошибка 5');
        }
    })
    .catch(() => {
        console.log('Ошибка 6');
    })
}


function taskClickHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.remove('hidden');

    let taskID = evt.currentTarget.id;
    sendTaskInfo(URL_CARDS, taskID);

    console.log(taskID);
}

tasks.forEach((task) => {
    task.addEventListener('click', taskClickHandler);
}) 