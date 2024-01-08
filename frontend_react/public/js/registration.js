import { URL_LOGIN, URL_REG } from "./modules/urls.js";
import { checkEmptyInputs, getJSONForm, setTokens } from "./modules/utility.js";
import { postData } from "./modules/requests.js";

const form = document.querySelector('.second-part');

const roleInput = form.querySelector('#role');
const studentRoleButton = form.querySelector('#student');
const teacherRoleButton = form.querySelector('#teacher');

const nextButton = form.querySelector('.arrow-button');
const backButton = form.querySelector('.arrow-button-left');
const regFirstPart = form.querySelector('.reg-first-part');
const regSecondPart = form.querySelector('.reg-second-part');

const popup = document.querySelector('.popup')

studentRoleButton.addEventListener('click', () => {
    studentRoleButton.classList.add('active-role-button');
    teacherRoleButton.classList.remove('active-role-button');
    roleInput.value = studentRoleButton.dataset.value;
});

teacherRoleButton.addEventListener('click', () => {
    teacherRoleButton.classList.add('active-role-button');
    studentRoleButton.classList.remove('active-role-button');
    roleInput.value = teacherRoleButton.dataset.value;
});

nextButton.addEventListener('click', () => {
    const inputsFirstPart = form.querySelectorAll('.first-part-reg')

    if (checkEmptyInputs(inputsFirstPart)) {
        regFirstPart.classList.add('hidden');
        regSecondPart.classList.remove('hidden');
    }
});

backButton.addEventListener('click', () => {
    regFirstPart.classList.remove('hidden');
    regSecondPart.classList.add('hidden');
});

function successLogin (res) {
    setTokens(res);
}

function successRegistration () {
    const userName = form.querySelector('#username');
    const password = form.querySelector('#password');
    const LOGIN_DATA = {
        username: `${userName.value}`,
        password: `${password.value}`
    }

    form.reset();
    studentRoleButton.classList.remove('active-role-button');
    teacherRoleButton.classList.remove('active-role-button');
    regFirstPart.classList.remove('hidden');
    regSecondPart.classList.add('hidden');
    popup.classList.remove('hidden');

    postData(URL_LOGIN, JSON.stringify(LOGIN_DATA), successLogin);
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputsSecondPart = form.querySelectorAll('.second-part-reg')
    if (checkEmptyInputs(inputsSecondPart)) {
        postData(URL_REG, getJSONForm(form), successRegistration);
    }
})

// попап

const closeButton = popup.querySelector('.close-btn');

function closePopup () {
    popup.classList.add('hidden');
}

function keyDown (evt) {
    if (evt.key === 'Escape') {
        closePopup();
    }
}

function clickOutsidePopup (evt) {
    const click = evt.composedPath();
    const popupClick = popup.querySelector('.success-registration');

    if (!click.includes(popupClick)) {
        closePopup();
    }
}

closeButton.addEventListener('click', () => {
    closePopup();
});

document.addEventListener('keydown', keyDown);
document.addEventListener('click', clickOutsidePopup);