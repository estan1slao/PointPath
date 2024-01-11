const addEventOnPopup = function(role) {
    const approveFormPopup = document.querySelector('.success-sendForm').closest('.popup');
    const proposePrForm = document.querySelector('form');
    
    const popupText = approveFormPopup.querySelector('.popup-text');
    const popupLink = approveFormPopup.querySelector('.popup-link');
    const popupColor = approveFormPopup.querySelector('.success-sendForm');

    if (role === 'учитель') {
        popupText.textContent = 'Ваш проект был успешно добавлен в каталог!';
        popupLink.classList.add('hidden');
        popupColor.style.backgroundColor = '#96EC8E';
        popupText.style.marginBottom = '74px';
    }

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
}

export { addEventOnPopup };