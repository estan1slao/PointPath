const cardTempPreview = document.querySelector('#card-preview').content.querySelector('.task');
const plannedList = document.querySelector('.list-of-tasks.planned');
const workList = document.querySelector('.list-of-tasks.work');
const checkedList = document.querySelector('.list-of-tasks.checked');
const doneList = document.querySelector('.list-of-tasks.done');

const savedData = window.location.search;
const userData = new URLSearchParams(savedData);

const projId = userData.get('id');

const URL_GETCARDS = `http://127.0.0.1:8000/getcards/${projId}/`;
const URL_OPENCARD = 'http://127.0.0.1:8000/card/';

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
const getDataCards = (url) => {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
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
        result.forEach((item) => {
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
        
    })
    .catch(() => {
        console.log('Ошибка в GET запросе, но не в URL')
    })
}

getDataCards(URL_GETCARDS);

function sendNewCategoryInfo(url,token, data) {
    fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            category: data
        })
    })
    .then((response) => {
        if (response.ok) {
            console.log(response);
        }
        else {
            console.log('Ошибка в POST запросе на отправку новой информации');
        }
    })
    .catch(() => {
        console.log('Ошибка в POST запросе на отправку новой информации, но не в URL');
    })
}

const dragAndDrop = () => {
    const lists = document.querySelectorAll('.list-of-tasks');
    const task = document.querySelectorAll('.task');

    for (let i = 0; i < task.length; i++) {
        const item = task[i];

        item.addEventListener('dragstart', () => {
            console.log(1);
            draggedTask = item;
            setTimeout(() => {
                item.classList.add('hidden');
            }, 0)
        })

        item.addEventListener('dragend', () => {
            draggedTask = item;
            console.log(2);
            setTimeout(() => {
                item.classList.remove('hidden');
                draggedTask = null;
            }, 0)
        })

        for (let j = 0; j < lists.length; j++) {
            const list = lists[j];
    
            list.addEventListener('dragover', (evt) => {
                console.log(3);
                evt.preventDefault();
            })
    
            list.addEventListener('drop', function (evt) {
                console.log(4);
                this.append(draggedTask);

                const FULL_URL_OPENCARD = `${URL_OPENCARD}${projId}/${draggedTask.id}/`;

                sendNewCategoryInfo(FULL_URL_OPENCARD, tokens.access, this.classList[1]);
            })
        }
    }
}
