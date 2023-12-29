// получение данных о проекте

const savedData = window.location.search;
const data = new URLSearchParams(savedData);

const projTitle = document.querySelector('.title');
const teacher = document.querySelector('#teacher');
const sphere = document.querySelector('#sphere');
const about = document.querySelector('#about')

projTitle.textContent = data.get('topic');
teacher.textContent = data.get('user');
sphere.textContent = data.get('sphere');
about.textContent = data.get('about');

const projId = data.get('id');

const URL_DENY = `http://127.0.0.1:8000/projects/teacher-denied-project/${projId}/`;
const URL_ACCEPT = `http://127.0.0.1:8000/projects/teacher-accept-project/${projId}/`;

const projState = data.get('state');
const studentId = data.get('studentId');

const takeButton = document.querySelector('.student-choice');
const trajectoryButton = document.querySelector('.trajectory');
const approveButton = document.querySelector('.approve');
const rejectButton = document.querySelector('.reject');

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

if (projState === '1') {
    takeButton.classList.add('hidden');
    trajectoryButton.classList.remove('hidden');
    trajectoryButton.addEventListener('click', () => {
        window.location.href = `./trajectory.html?${data}`;
    });
} else if (projState === '0' && studentId !== null) {
    takeButton.classList.add('hidden');
    approveButton.classList.remove('hidden');
    rejectButton.classList.remove('hidden');

    approveButton.addEventListener('click', () => {
        acceptProject(URL_ACCEPT, tokens.access, onSuccessAccept)
    });
    
    rejectButton.addEventListener('click', () => {
        console.log(tokens);
        denyProject(URL_DENY, tokens.access, onSuccessDeny);
    });
}

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

takeButton.addEventListener('click', () => {
    postDataProj(URL_TAKE_PROJ, tokens.access, console.log);
});


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

getDataLogin(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const projectTab = document.querySelector('#project');
    const trajectoryTab = document.querySelector('#trajectory');
    const projectsToApproveTab = document.querySelector('#projects-to-approve');
    const proposeProjectTab = document.querySelector('#propose-project');
    const fi = document.querySelector('#fi');
    const projOwner = document.querySelector('#proj-owner');

    if (data.role === "ученик") { 
        proposeProjectTab.classList.add('hidden');
        
        fi.textContent = `${data.last_name} ${data.first_name}`;
    }
    else {
        projectTab.classList.add('hidden');
        trajectoryTab.classList.add('hidden');
        projectsToApproveTab.classList.remove('hidden');
        projOwner.textContent = 'ученик';

        fi.textContent = `${data.last_name} ${data.first_name} ${data.patronymic}`;
    }
}

// принять/отклонить проект

const approvePopup = document.querySelector('.approve-form').closest('.popup');;
const deniedPopup = document.querySelector('.denied-form').closest('.popup');;

const closeApproveButton = approvePopup.querySelector('.close-btn');
const closeDeniedButton = deniedPopup.querySelector('.close-btn');

function acceptProject (url, token, onSuccess) {
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

function onSuccessAccept (res) {
    console.log(res);

    closeApproveButton.addEventListener('click', () => {
        window.location.href = "./consideration-projects.html";
    });
}

function denyProject (url, token, onSuccess) {
    fetch(url,
    {
        method: 'DELETE',
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

function onSuccessDeny (res) {
    console.log(res);

    closeDeniedButton.addEventListener('click', () => {
        window.location.href = "./consideration-projects.html";
    });

    
}