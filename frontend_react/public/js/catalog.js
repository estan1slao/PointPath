const URL_PROJECTS = 'http://127.0.0.1:8000/projects/choose/';
// http://127.0.0.1:8000/projects/student-get-projects/

const cardTemplate = document.querySelector('#project-card-template')
    .content
    .querySelector('.project-card');

const catalog = document.querySelector('.catalog');

function getDataLogin (url, onSuccess) {
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

getDataLogin(URL_PROJECTS, onSuccessGetProjects);

function onSuccessGetProjects (projects) {
    projects.forEach(project => {
        const card = cardTemplate.cloneNode(true);

        card.querySelector('.title-card').textContent = project.topic;
        card.querySelector('#teacher-name').textContent = project.teacher;
        card.querySelector('#sphere').textContent = project.field_of_activity;
        card.querySelector('.card-description').textContent = project.about;

        catalog.append(card);
    });
}