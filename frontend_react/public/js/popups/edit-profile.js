const editProfilePopup = document.querySelector('.edit-profile').closest('.popup');
const editBtn = document.querySelector('.edit');

function saveBtnHandler (evt) {
    evt.preventDefault();
    

    closeBtn.removeEventListener('click', closeHandler);
    saveBtn.removeEventListener('click', saveBtnHandler);
}

function closeHandler (evt) {
    evt.preventDefault();
    editProfilePopup.classList.add('hidden');

    closeBtn.removeEventListener('click', closeHandler);
    saveBtn.removeEventListener('click', saveBtnHandler);
}

function editBtnHandler (evt) {
    evt.preventDefault();
    editProfilePopup.classList.remove('hidden');

    const closeBtn = editProfilePopup.querySelector('.close-btn');
    const saveBtn = editProfilePopup.querySelector('.save-button');

    closeBtn.addEventListener('click', closeHandler);
    saveBtn.addEventListener('click', saveBtnHandler);
}

editBtn.addEventListener('click', editBtnHandler);
