const editProfilePopup = document.querySelector('.edit-profile').closest('.popup');
const editBtn = document.querySelector('.edit');

function saveBtnHandler (evt) {
    evt.preventDefault();

    // сюда надо добавить запрос
    // надо подумать над удалением обработчиков

    this.removeEventListener('click', saveBtnHandler);
}

function closeHandlerEditPr (evt) {
    evt.preventDefault();
    editProfilePopup.classList.add('hidden');

    this.removeEventListener('click', closeHandlerEditPr);
}

function editBtnHandler (evt) {
    evt.preventDefault();
    editProfilePopup.classList.remove('hidden');

    // надо подумать над удалением обработчиков

    const closeBtn = editProfilePopup.querySelector('.close-btn');
    const saveBtn = editProfilePopup.querySelector('.save-button');

    closeBtn.addEventListener('click', closeHandlerEditPr);
    saveBtn.addEventListener('click', saveBtnHandler);
}

editBtn.addEventListener('click', editBtnHandler);
