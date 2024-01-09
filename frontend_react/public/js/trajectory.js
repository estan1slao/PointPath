import { getTokens } from "./modules/utility.js";
import { URL_OPEN_CARD, URL_PROFILE, URL_GET_CARDS } from "./modules/urls.js";
import { getData, getListOfData, editData } from "./modules/requests.js";

const cardTempPreview = document.querySelector('#card-preview')
    .content
    .querySelector('.task');
const plannedList = document.querySelector('.list-of-tasks.planned');
const workList = document.querySelector('.list-of-tasks.work');
const checkedList = document.querySelector('.list-of-tasks.checked');
const doneList = document.querySelector('.list-of-tasks.done');

const savedData = window.location.search;
const userData = new URLSearchParams(savedData);
const projId = userData.get('id');
let draggedTask;
const tokens = getTokens();

// Логика для вкладок header
getData(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const projectTab = document.querySelector('#project');
    const trajectoryTab = document.querySelector('#trajectory');
    const projectsToApproveTab = document.querySelector('#projects-to-approve');
    const proposeProjectTab = document.querySelector('#propose-project');
    const fi = document.querySelector('#fi');
    const title = document.querySelector('.title');
    const projectName = document.querySelector('.project-name');

    if (data.role === "ученик") { 
        proposeProjectTab.classList.add('hidden');
        
        fi.textContent = `${data.last_name} ${data.first_name}`;
    }
    else {
        projectTab.classList.add('hidden');
        trajectoryTab.classList.add('hidden');
        projectsToApproveTab.classList.remove('hidden');

        title.textContent = userData.get('user'); // здесь должно быть имя ученика, который делает данный проект
        projectName.classList.remove('hidden');
        projectName.textContent = userData.get('topic'); //здесь должно быть имя проекта ученика, который делает данный проект

        fi.textContent = `${data.last_name} ${data.first_name} ${data.patronymic}`;

    }
    
}

// добавление карточек
function drawCards(arr) {
    arr.forEach((item) => {
        const task = cardTempPreview.cloneNode(true);

        task.querySelector('.task-title').textContent = `${item.task}`;
        task.id = `${item.card_id}`;

        switch (item.category) {
            case 'planned':
                plannedList.appendChild(task);
                break;
            case 'work':
                workList.appendChild(task);
                break;
            case 'checked':
                checkedList.appendChild(task);
                break;
            case 'done':
                doneList.appendChild(task);
                break;
            default:
                break;
        }
    })
    dragAndDrop();
}

getListOfData(URL_GET_CARDS + `${projId}/`, drawCards);

const dragAndDrop = () => {
    const lists = document.querySelectorAll('.list-of-tasks');
    const task = document.querySelectorAll('.task');

    for (let i = 0; i < task.length; i++) {
        const item = task[i];

        item.addEventListener('dragstart', () => {
            draggedTask = item;
            setTimeout(() => {
                item.classList.add('hidden');
            }, 0)
        })

        item.addEventListener('dragend', () => {
            draggedTask = item;
            setTimeout(() => {
                item.classList.remove('hidden');
                draggedTask = null;
            }, 0)
        })

        for (let j = 0; j < lists.length; j++) {
            const list = lists[j];
    
            list.addEventListener('dragover', (evt) => {
                evt.preventDefault();
            })
    
            list.addEventListener('drop', function (evt) {
                this.append(draggedTask);
                const FULL_URL_OPENCARD = `${URL_OPEN_CARD}${projId}/${draggedTask.id}/`;
                editData(FULL_URL_OPENCARD, tokens.access, JSON.stringify({category: this.classList[1]}), console.log);
            })
        }
    }
}
