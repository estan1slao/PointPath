const approveFormPopupT = document.querySelector('.success-sendForm-t').closest('.popup');
const proposePrForm = document.querySelector('form');

function closeBtnActivePrHandlerT () {
    approveFormPopupT.classList.add('hidden');
    this.removeEventListener('click', closeBtnActivePrHandler);
}

function proposePrFormHandlerT (evt) {
    evt.preventDefault();
    approveFormPopupT.classList.remove('hidden');
    
    const closeBtn = approveFormPopupT.querySelector('.close-btn');

    closeBtn.addEventListener('click', closeBtnActivePrHandlerT);
}

proposePrForm.addEventListener('submit', proposePrFormHandlerT);
