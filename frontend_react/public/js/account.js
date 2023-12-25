const URL_PROFILE = 'http://127.0.0.1:8000/profile/';

const fio = document.querySelector('#fio');
const fi = document.querySelector('#fi');
const email = document.querySelector('#email');
const grade = document.querySelector('#grade');
const tg = document.querySelector('#tg');
const vk = document.querySelector('#vk');
const phone = document.querySelector('#phone');
const about = document.querySelector('.skills-text');

const tokens = {};
getTokens();

function getDataLogin (url, token, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
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
    })
    .catch(() => {
        console.log('Ошибка');
    });
}

function getTokens () {
    const cookies = document.cookie.split('; ');

    cookies.forEach((token) => {
        const [name, value] = token.split('=');
        if (name === 'access') {
            tokens.access = value;
        } else if (name === 'refresh') {
            tokens.refresh = value;
        }
    })
}

getDataLogin(URL_PROFILE, tokens.access, fillData);


// редактирование профиля (попап)

const editPopupWrapper = document.querySelector('.edit-profile').closest('.popup');
const editButton = document.querySelector('.edit-button');
const closeEditButton = editPopupWrapper.querySelector('.close-btn');
const form = editPopupWrapper.querySelector('.edit-form');

const aboutInput = form.querySelector('#about-input');
const gradeInput = form.querySelector('#grade-input');
const telegramInput = form.querySelector('#telegram-input');
const vkInput = form.querySelector('#vk-input');
const phoneInput = form.querySelector('#phone-input');

const DEFAULT_DESCRIPTION = 'Здесь пока ничего нет, но вы можете рассказать немного о себе :)';
const DEFAULT_GRADE = 'не указан';

function openEditPopup () {
    editPopupWrapper.classList.remove('hidden');

    if (about.textContent !== DEFAULT_DESCRIPTION) {
        aboutInput.value = about.textContent;
    } else {
        aboutInput.value = "";
    }

    if (grade.textContent !== DEFAULT_GRADE) {
        gradeInput.value = grade.textContent;
    } else {
        gradeInput.value = "";
    }

    telegramInput.value = tg.href;
    vkInput.value = vk.href;
    phoneInput.value = phone.href.slice(4);

    closeEditButton.addEventListener('click', closeEditForm);
}

editButton.addEventListener('click', () => {
    openEditPopup();
});

function closeEditForm () {
    editPopupWrapper.classList.add('hidden');
    closeEditButton.removeEventListener('click', closeEditForm);
}

function reloadPage () {
    document.location.reload();
};


// редактирование (логика)

const URL_EDIT = 'http://127.0.0.1:8000/profile/update/';

const noContactsLabel = document.querySelector('.no-contacts');
const saveEditButton = form.querySelector('.save-button');

function blockSubmitBtn () {
    saveEditButton.disabled = true;
};

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    blockSubmitBtn();
    putDataEdit(URL_EDIT, tokens.access, getJSONForm(form), reloadPage);
})

function putDataEdit (url, token, data, onSuccess) {
    fetch(url,
    {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        body: data,
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Ошибка 1');
        }
    })
    .then((result) => {
        onSuccess();
    })
    .catch(() => {
        console.log('Ошибка 2');
    });
}

function getJSONForm (formValues) {
    const formData = new FormData(formValues);
    let object = {};
    formData.forEach((value, key) => {
        if (key === 'grade') {
            object['info'] = {
                grade: value
            }
        } else {
            object[key] = value;
        }
    });
    return JSON.stringify(object);
}

function fillData (data) {
    fio.textContent = `${data.last_name} ${data.first_name} ${data.patronymic}`;
    email.textContent = data.email;
    fi.textContent = `${data.last_name} ${data.first_name}`;

    if (data.info.grade !== null && data.info.grade !== "") {
        grade.textContent = data.info.grade;
    }
    if (data.about !== null && data.about !== "") {
        about.textContent = data.about;
    }   

    if (data.telegram !== null && data.telegram !== "") {
        tg.href = data.telegram;
        tg.closest('li').classList.remove('hidden');
        noContactsLabel.classList.add('hidden');
    }
    if (data.vk !== null && data.vk !== "") {
        vk.href = data.vk;
        vk.closest('li').classList.remove('hidden');
        noContactsLabel.classList.add('hidden');
    }
    if (data.phone_number !== null && data.phone_number !== "") {
        phone.href = `tel:${data.phone_number}`;
        phone.closest('li').classList.remove('hidden');
        noContactsLabel.classList.add('hidden');
    }
}