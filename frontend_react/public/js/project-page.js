import { URL_ACCEPT_PROJ, URL_DENY_PROJ, URL_TAKE_PROJ, URL_PROFILE } from "./modules/urls.js";
import { getTokens } from "./modules/utility.js";
import { changeProjStatus, getData, deleteProject } from "./modules/requests.js";

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

const URL_DENY = URL_DENY_PROJ + `${projId}/`;
const URL_ACCEPT = URL_ACCEPT_PROJ + `${projId}/`;

const projState = data.get('state');
const studentId = data.get('studentId');

const takeButton = document.querySelector('.student-choice');
const trajectoryButton = document.querySelector('.trajectory');
const approveButton = document.querySelector('.approve');
const rejectButton = document.querySelector('.reject');

const tokens = getTokens();

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
        changeProjStatus(URL_ACCEPT, tokens.access, onSuccessApprove)
    });
    
    rejectButton.addEventListener('click', () => {
        deleteProject(URL_DENY, tokens.access, onSuccessDeny);
    });
}

const URL_TAKE = URL_TAKE_PROJ + `${projId}/`;

takeButton.addEventListener('click', () => {
    changeProjStatus(URL_TAKE, tokens.access, console.log);
});


// Логика для вкладок header
getData(URL_PROFILE, tokens.access, fillData);

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

function onSuccessApprove (res) {
    console.log(res);

    closeApproveButton.addEventListener('click', () => {
        window.location.href = "./consideration-projects.html";
    });
}

function onSuccessDeny () {
    closeDeniedButton.addEventListener('click', () => {
        window.location.href = "./consideration-projects.html";
    });
}