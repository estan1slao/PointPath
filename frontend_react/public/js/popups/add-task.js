// реализовано только пока добавление по кнопке

const addTaskBtn = document.querySelector('.add-task');
const taskPopup = document.querySelector('.edit-task').closest('.popup');

function closeBtnTaskHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.add('hidden');
    this.removeEventListener('click', closeBtnTaskHandler);
}

function addTaskBtnHandler (evt) {
    evt.preventDefault();
    taskPopup.classList.remove('hidden');
    const closeBtn = taskPopup.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeBtnTaskHandler);
}

addTaskBtn.addEventListener('click', addTaskBtnHandler);