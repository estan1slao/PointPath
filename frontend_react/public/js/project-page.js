const savedData = window.location.search;
const data = new URLSearchParams(savedData);

const projTitle = document.querySelector('.title');
const teacher = document.querySelector('#teacher');
const sphere = document.querySelector('#sphere');
const about = document.querySelector('#about')

projTitle.textContent = data.get('topic');
teacher.textContent = data.get('teacher');
sphere.textContent = data.get('sphere');
about.textContent = data.get('about');

const projId = data.get('id');

const URL_TAKE_PROJ = `http://127.0.0.1:8000/projects/student-choose-project/${projId}/`;

function postDataProj (url, token, onSuccess) {
    fetch(url,
    {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            onSuccess();
        } else {
            console.log('Ошибка 1');
        }
    })
    .catch(() => {
        console.log('Ошибка 2');
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

const tokens = {};
getTokens();

const takeButton = document.querySelector('.student-choice');

takeButton.addEventListener('click', () => {
    postDataProj(URL_TAKE_PROJ, tokens.access, console.log);
});