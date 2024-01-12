const finishProjectPopup = document.querySelector('.finish-project').closest('.popup');
const finishBtn = document.querySelector('.finish');

function closeBtnFinishPrHandler (evt) {
    evt.preventDefault();
    finishProjectPopup.classList.add('hidden');
}

function finishBtnHandler (evt) {
    evt.preventDefault();
    finishProjectPopup.classList.remove('hidden');
    const closeBtn = finishProjectPopup.querySelector('.close-btn');
    const returnLink = finishProjectPopup.querySelector('.return-link');

    returnLink.addEventListener('click', closeBtnFinishPrHandler);
    closeBtn.addEventListener('click', closeBtnFinishPrHandler);
}

finishBtn.addEventListener('click', finishBtnHandler);