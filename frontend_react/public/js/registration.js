const userDataRegister = {
    username: 'insaneee1',
    email: 'daybov1_al@mail.ru',
    password: 'sanya123',
    password2: 'sanya123',
    role: 'ученик',
    name: 'Александр',
    surname: 'Дайбов',
    patronymic: 'Валерьевич',
}

const form = document.querySelector('.second-part');

const roleInput = form.querySelector('#role');
const studentRoleButton = form.querySelector('#student');
const teacherRoleButton = form.querySelector('#teacher');

const nextButton = form.querySelector('.arrow-button');
const backButton = form.querySelector('.arrow-button-left');
const regFirstPart = form.querySelector('.reg-first-part');
const regSecondPart = form.querySelector('.reg-second-part');

const popup = document.querySelector('.popup')
// const submitButton = form.querySelector('.account-submit');


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
    const inputs = form.querySelectorAll('.first-part')
    let flag = true;
    inputs.forEach((input) => {
        if (input.value === "") {
            flag = false;
        }
    })

    if (flag) {
        regFirstPart.classList.add('hidden');
        regSecondPart.classList.remove('hidden');
    }
});

backButton.addEventListener('click', () => {
    regFirstPart.classList.remove('hidden');
    regSecondPart.classList.add('hidden');
});


function getJSON (formValues) {
    const formData = new FormData(formValues);
    let object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    return JSON.stringify(object);
}

function postData (formData) {
    fetch('http://127.0.0.1:8000/register/',
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: getJSON(formData),
    },
    )
    .then((response) => {
        if (response.ok) {
            showPopup();
            clearForm();
        } else {
            console.log('Ошибка');
        }
    })
    .catch(() => {
        console.log('Ошибка');
    });
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    postData(form);
})

function clearForm () {
    form.reset();
    studentRoleButton.classList.remove('active-role-button');
    teacherRoleButton.classList.remove('active-role-button');
    regFirstPart.classList.remove('hidden');
    regSecondPart.classList.add('hidden');
}

// попап

const closeButton = popup.querySelector('.close-btn');

function closePopup () {
    popup.classList.add('hidden');
}

function showPopup () {
    popup.classList.remove('hidden');
}

function keyDown (evt) {
    if (evt.key === 'Escape') {
        closePopup();
    }
}

function clickOutsideDropdown (evt) {
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
document.addEventListener('click', clickOutsideDropdown);