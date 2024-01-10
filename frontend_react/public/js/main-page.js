const questionsList = document.querySelectorAll('.question-item');

questionsList.forEach((item) => {
    const questionWrapper = item.querySelector('.question-wrapper');
    const image = questionWrapper.querySelector('img');
    const answer = item.querySelector('.answer');

    questionWrapper.addEventListener('click', () => {
        answer.classList.toggle('hidden');
        questionWrapper.classList.toggle('open');
        if (questionWrapper.classList.contains('open')) {
            image.src = "./img/cross-rotate.svg";
        } else {
            image.src = "./img/cross.svg";
        }
        
    })
})

// Логика для вкладок header
const URL_PROFILE = 'http://127.0.0.1:8000/profile/';

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
            console.log('Ошибка 1');
        }
    })
    .then((result) => {
        onSuccess(result);
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

getDataLogin(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const projectTab = document.querySelector('#project');
    const trajectoryTab = document.querySelector('#trajectory');
    const projectsToApproveTab = document.querySelector('#projects-to-approve');
    const proposeProjectTab = document.querySelector('#propose-project');
    const enterTab = document.querySelector('#enter');
    const createAccountTab = document.querySelector('#create-account');
    const fi = document.querySelector('#fi');
    const accountTab = document.querySelector('.account');

    if (data.role === "ученик") { 
        projectTab.classList.remove('hidden');
        trajectoryTab.classList.remove('hidden');
        enterTab.classList.add('hidden');
        createAccountTab.classList.add('hidden');
        accountTab.classList.remove('hidden');
        
        fi.textContent = `${data.last_name} ${data.first_name}`;
    }
    else {
        proposeProjectTab.classList.add('hidden');
        projectsToApproveTab.classList.remove('hidden');
        enterTab.classList.add('hidden');
        createAccountTab.classList.add('hidden');
        accountTab.classList.remove('hidden');

        fi.textContent = `${data.last_name} ${data.first_name} ${data.patronymic}`;
    }
    
}

