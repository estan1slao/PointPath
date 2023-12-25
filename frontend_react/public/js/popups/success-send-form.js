const approveFormPopup = document.querySelector('.success-sendForm').closest('.popup');
const proposePrForm = document.querySelector('form');

function closeBtnActivePrHandler () {
    approveFormPopup.classList.add('hidden');
    this.removeEventListener('click', closeBtnActivePrHandler);
}

function proposePrFormHandler (evt) {
    evt.preventDefault();
    approveFormPopup.classList.remove('hidden');
    
    const closeBtn = approveFormPopup.querySelector('.close-btn');

    closeBtn.addEventListener('click', closeBtnActivePrHandler);
}

proposePrForm.addEventListener('submit', proposePrFormHandler);
