const URL_GETCARDS = 'http://127.0.0.1:8000/getcards/';
const URL_OPENCARD = 'http://127.0.0.1:8000/card/';

const cardTempPreview = document.querySelector('#card-preview').content.querySelector('.task');
const plannedList = document.querySelector('.list-of-tasks.planned');
const workList = document.querySelector('.list-of-tasks.work');
const checkedList = document.querySelector('.list-of-tasks.checked');
const doneList = document.querySelector('.list-of-tasks.done');

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

function sendNewCategoryInfo(url, data) {
    fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
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
    debugger
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
                sendNewCategoryInfo(URL_OPENCARD + draggedTask.id, this.classList[1]);
            })
        }
    }
}

getDataCards(URL_GETCARDS);