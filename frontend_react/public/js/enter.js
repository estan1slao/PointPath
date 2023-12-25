const URL_LOGIN = 'http://127.0.0.1:8000/token/';

const form = document.querySelector('.login-form');

// const enterButton = form.querySelector('.arrow-button');
// const usernameInput = form.querySelector('#username');
// const passwordInput = form.querySelector('#password');

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputs = form.querySelectorAll('.enter-input');
    if (checkEmptyInputs(inputs)) {
        postDataLogin(URL_LOGIN, getJSONForm(form), successLogin);
    }
});

function getJSONForm (formValues) {
    const formData = new FormData(formValues);
    let object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    return JSON.stringify(object);
}

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
            console.log('Ошибка 1');
        }
    })
    .then((result) => {
        onSuccess(result);
        console.log(document.cookie);
    })
    .catch(() => {
        console.log('Ошибка 2');
    });
}

function checkEmptyInputs (inputs) {
    let flag = true;
    inputs.forEach((input) => {
        if (input.value === "") {
            flag = false;
        }
    })
    return flag;
}

function setTokens (res) {
    document.cookie = "access=" + encodeURIComponent(res.access) + "; expires=дата_истечения; path=/";
    document.cookie = "refresh=" + encodeURIComponent(res.refresh) + "; expires=дата_истечения; path=/";
}

function successLogin (res) {
    setTokens(res);
    form.reset();
    window.location.href = './account-student.html';
}