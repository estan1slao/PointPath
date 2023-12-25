const exitApprovePopup = document.querySelector('.exit-approve').closest('.popup');
const exitBtn = document.querySelector('.account').querySelector('img');

function closeHandler (evt) {
    evt.preventDefault();
    exitApprovePopup.classList.add('hidden');

    closeBtn.removeEventListener('click', closeHandler);
    returnBtn.removeEventListener('click', closeHandler);
}

function exitBtnHandler (evt) {
    evt.preventDefault();
    exitApprovePopup.classList.remove('hidden');

    const closeBtn = exitApprovePopup.querySelector('.close-btn');
    const returnBtn = exitApprovePopup.querySelector('.return-link'); 

    closeBtn.addEventListener('click', closeHandler);
    returnBtn.addEventListener('click', closeHandler);
}

exitBtn.addEventListener('click', exitBtnHandler);
