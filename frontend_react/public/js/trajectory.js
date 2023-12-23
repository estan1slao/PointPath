// draggedTask = null;

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