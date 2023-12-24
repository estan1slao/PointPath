const URL_PROFILE = 'http://127.0.0.1:8000/profile/';

const fio = document.querySelector('#fio');
const fi = document.querySelector('#fi');
const email = document.querySelector('#email');

const tokens = {};
getTokens();

function getDataLogin (url, data, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data}`
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
        fio.textContent = `${result.last_name} ${result.first_name} ${result.patronymic}`;
        email.textContent = `${result.email}`;
        fi.textContent = `${result.last_name} ${result.first_name}`;
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
    console.log(tokens);
}

getDataLogin(URL_PROFILE, tokens.access, console.log);

