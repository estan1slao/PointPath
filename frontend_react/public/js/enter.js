const button = document.querySelector('.enter-title');

const tokens = {};

const userDataLogin = {
    username: 'insaneee1',
    password: 'sanya123',
}

button.addEventListener('click', () => {
    fetch('http://127.0.0.1:8000/token/',
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(userDataLogin),
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
        document.cookie = "access=" + encodeURIComponent(result.access) + "; expires=дата_истечения; path=/";
        document.cookie = "refresh=" + encodeURIComponent(result.refresh) + "; expires=дата_истечения; path=/";
        getTokens();
    })
    .catch(() => {
        console.log('Ошибка');
    });
})

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

