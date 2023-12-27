const successChoicePopup = document.querySelector('.success-choice').closest('.popup');
const studentChoiceBtn = document.querySelector('.student-choice');

function closeBtnSuccessChoiceHandler (evt) {
    evt.preventDefault();
    successChoicePopup.classList.add('hidden');
    this.removeEventListener('click', closeBtnSuccessChoiceHandler);
}

function studentChoiceBtnHandler (evt) {
    evt.preventDefault();
    successChoicePopup.classList.remove('hidden');
    const closeBtn = successChoicePopup.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeBtnSuccessChoiceHandler);
}

studentChoiceBtn.addEventListener('click', studentChoiceBtnHandler)