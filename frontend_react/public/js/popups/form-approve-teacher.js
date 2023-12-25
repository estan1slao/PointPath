const approveFormPopup = document.querySelector('.approve-form').closest('.popup');
const deniedFormPopup = document.querySelector('.denied-form').closest('.popup');
const approveBtn = document.querySelector('.approve');
const rejectBtn = document.querySelector('.reject');

function closeBtnApproveHandler (evt) {
    evt.preventDefault();

    approveFormPopup.classList.add('hidden');
    deniedFormPopup.classList.add('hidden');

    approveBtn.classList.add('hidden');
    rejectBtn.classList.add('hidden');

    this.removeEventListener('click', closeBtnApproveHandler);
}

function approveBtnHandler (evt) {
    evt.preventDefault();
    approveFormPopup.classList.remove('hidden');
    const closeBtn = approveFormPopup.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeBtnApproveHandler);
}

function rejectBtnHandler (evt) {
    evt.preventDefault();
    deniedFormPopup.classList.remove('hidden');
    const closeBtn = deniedFormPopup.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeBtnApproveHandler);
}

approveBtn.addEventListener('click', approveBtnHandler);
rejectBtn.addEventListener('click', rejectBtnHandler);