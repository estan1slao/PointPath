const form = document.querySelector('.second-part');

const roleInput = form.querySelector('#role');
const studentRoleButton = form.querySelector('#student');
const teacherRoleButton = form.querySelector('#teacher');

const nextButton = form.querySelector('.arrow-button');
const backButton = form.querySelector('.arrow-button-left');
const regFirstPart = form.querySelector('.reg-first-part');
const regSecondPart = form.querySelector('.reg-second-part');

const popup = document.querySelector('.popup')


// TODO: вынести в константы
const URL_REG = 'http://127.0.0.1:8000/register/';
const URL_LOGIN = 'http://127.0.0.1:8000/token/';

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


// TODO: вынести эту функцию в утилиты
function checkEmptyInputs (inputs) {
    let flag = true;
    inputs.forEach((input) => {
        if (input.value === "") {
            flag = false;
        }
    })
    return flag;
}

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


// TODO: вынести эту функцию в утилиты
function getJSONForm (formValues) {
    const formData = new FormData(formValues);
    let object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    return JSON.stringify(object);
}

function postDataReg (url, data, onSuccess) {
    fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: data,
    },
    )
    .then((response) => {
        if (response.ok) {
            onSuccess();
        } else {
            console.log('Ошибка');
        }
    })
    .catch(() => {
        console.log('Ошибка');
    });
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

    postDataLogin(URL_LOGIN, JSON.stringify(LOGIN_DATA), successLogin);
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputsSecondPart = form.querySelectorAll('.second-part-reg')
    if (checkEmptyInputs(inputsSecondPart)) {
        postDataReg(URL_REG, getJSONForm(form), successRegistration);
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

// авторизация (вход после реги)

// TODO: вынести эту функцию в утилиты
function postDataLogin (url, data, onSuccess) {
    fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: data,
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Ошибка');
        }
    })
    .then((result) => {
        onSuccess(result);
        console.log(document.cookie);
    })
    .catch(() => {
        console.log('Ошибка');
    });
}


// TODO: вынести эту функцию в утилиты
function setTokens (res) {
    document.cookie = "access=" + encodeURIComponent(res.access) + "; expires=дата_истечения; path=/";
    document.cookie = "refresh=" + encodeURIComponent(res.refresh) + "; expires=дата_истечения; path=/";
}

function successLogin (res) {
    setTokens(res);
}
