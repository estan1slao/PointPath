const URL_GETCARDS = 'http://127.0.0.1:8000/getcards/';
const cardTempPreview = document.querySelector('#card-preview').content.querySelector('.task');
const plannedList = document.querySelector('.list-of-tasks.planned');

function getDataCards (url) {
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

            plannedList.appendChild(task);
        })
    })
    .catch(() => {
        console.log('Ошибка в GET запросе, но не в URL')
    })
}

function dragAndDrop () {
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
            })
        }
    }
}
dragAndDrop(); //Там где будет логика добаления карточки - снова вызывать

getDataCards(URL_GETCARDS);

