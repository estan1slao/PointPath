const approveFormPopup = document.querySelector('.approve-form').closest('.popup');
const proposePrForm = document.querySelector('form');

function proposePrFormHandler () {
    approveFormPopup.classList.remove('hidden');
    setTimeout(() => {
        approveFormPopup.classList.add('hidden');
    }, 2000);
}

proposePrForm.addEventListener('submit', proposePrFormHandler); // сейчас submit не работает, тк нет четкой кнопки отправки проекта