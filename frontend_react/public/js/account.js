const URL_PROFILE = 'http://127.0.0.1:8000/profile/';
const URL_CUR_PROJ = "http://127.0.0.1:8000/projects/get-active/";

const fio = document.querySelector('#fio');
const fi = document.querySelector('#fi');
const email = document.querySelector('#email');
const grade = document.querySelector('#specification');
const tg = document.querySelector('#tg');
const vk = document.querySelector('#vk');
const phone = document.querySelector('#phone');
const about = document.querySelector('.skills-text');

const tokens = {};
getTokens();

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
            console.log('Ошибка');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('Ошибка');
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

getDataLogin(URL_PROFILE, tokens.access, fillData);


// редактирование профиля (попап)

const editPopupWrapper = document.querySelector('.edit-profile').closest('.popup');
const editButton = document.querySelector('.edit-button');
const closeEditButton = editPopupWrapper.querySelector('.close-btn');
const form = editPopupWrapper.querySelector('.edit-form');

const aboutInput = form.querySelector('#about-input');
const gradeInput = form.querySelector('#grade-input');
const telegramInput = form.querySelector('#telegram-input');
const vkInput = form.querySelector('#vk-input');
const phoneInput = form.querySelector('#phone-input');

const DEFAULT_DESCRIPTION = 'Здесь пока ничего нет, но вы можете рассказать немного о себе :)';
const DEFAULT_GRADE = 'не указан';
const DEFAULT_SPEC = 'не указана';

function openEditPopup () {
    editPopupWrapper.classList.remove('hidden');

    if (about.textContent !== DEFAULT_DESCRIPTION) {
        aboutInput.value = about.textContent;
    } else {
        aboutInput.value = "";
    }

    if (grade.textContent !== DEFAULT_GRADE && grade.textContent !== DEFAULT_SPEC) {
        gradeInput.value = grade.textContent;
    } else {
        gradeInput.value = "";
    }

    telegramInput.value = tg.href;
    vkInput.value = vk.href;
    phoneInput.value = phone.href.slice(4);

    closeEditButton.addEventListener('click', closeEditForm);
}

editButton.addEventListener('click', () => {
    openEditPopup();
});

function closeEditForm () {
    editPopupWrapper.classList.add('hidden');
    closeEditButton.removeEventListener('click', closeEditForm);
}

function reloadPage () {
    document.location.reload();
};


// редактирование (логика)

const URL_EDIT = 'http://127.0.0.1:8000/profile/update/';

const noContactsLabel = document.querySelector('.no-contacts');
const saveEditButton = form.querySelector('.save-button');

function blockSubmitBtn () {
    saveEditButton.disabled = true;
};

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    blockSubmitBtn();
    putDataEdit(URL_EDIT, tokens.access, getJSONForm(form), reloadPage);
})

function putDataEdit (url, token, data, onSuccess) {
    fetch(url,
    {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        body: data,
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
        onSuccess();
    })
    .catch(() => {
        console.log('Ошибка 2');
    });
}

function getJSONForm (formValues) {
    const formData = new FormData(formValues);
    let object = {};
    formData.forEach((value, key) => {
        if (key === 'grade') { 
            object['info'] = {
                grade: value
            }
        } else {
            object[key] = value;
        }

        if (key === 'discipline') {
            object['info'] = {
                discipline: value
            }
        } else {
            object[key] = value;
        }
    });
    return JSON.stringify(object);
}

function fillData (data) {
    const spec = document.querySelector('#specification-title');
    const student = document.querySelector('.student');
    const teacher = document.querySelector('.teacher');

    const projectTab = document.querySelector('#project');
    const trajectoryTab = document.querySelector('#trajectory');
    const projectsToApproveTab = document.querySelector('#projects-to-approve');
    const proposeProjectTab = document.querySelector('#propose-project');

    if (data.role === "учитель") {
        spec.textContent = "специализация";
        student.classList.add('hidden');
        teacher.classList.remove('hidden');

        form.querySelector('#grade-spec').textContent = "специализация";

        gradeInput.name = "discipline";
        
        if (data.info.discipline !== null && data.info.discipline !== "") {
            grade.textContent = data.info.discipline;
        } else {
            grade.textContent = "не указана";
        }

        projectTab.classList.add('hidden');
        trajectoryTab.classList.add('hidden');
        projectsToApproveTab.classList.remove('hidden');
        proposeProjectTab.classList.remove('hidden');

    } else if (data.role === "ученик") {
        if (data.info.grade !== null && data.info.grade !== "") {
            grade.textContent = data.info.grade;
        }
    }

    fio.textContent = `${data.last_name} ${data.first_name} ${data.patronymic}`;
    email.textContent = data.email;
    fi.textContent = `${data.last_name} ${data.first_name}`;

    if (data.about !== null && data.about !== "") {
        about.textContent = data.about;
    }   

    if (data.telegram !== null && data.telegram !== "") {
        tg.href = data.telegram;
        tg.closest('li').classList.remove('hidden');
        noContactsLabel.classList.add('hidden');
    }
    if (data.vk !== null && data.vk !== "") {
        vk.href = data.vk;
        vk.closest('li').classList.remove('hidden');
        noContactsLabel.classList.add('hidden');
    }
    if (data.phone_number !== null && data.phone_number !== "") {
        phone.href = `tel:${data.phone_number}`;
        phone.closest('li').classList.remove('hidden');
        noContactsLabel.classList.add('hidden');
    }

    getDataCurrentProj(URL_CUR_PROJ, tokens.access, onSuccessGetProj, onErrorGetProj, data);
}

// получить инфу о текущем проекте

function getDataCurrentProj (url, token, onSuccess, onError, roleData) {
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
        } else if (response.status === 400) {
            onError(roleData);
        } else {
            console.log('Ошибка 1');
        }
    })
    .then((result) => {
        onSuccess(result, roleData);
    })
    .catch(() => {
        console.log('Ошибка 2');
    });
}

const activeStudentProj = document.querySelector('.active-projects-s');
const activeTeacherProj = document.querySelector('.active-projects-t');

function onErrorGetProj (role) {
    if (role.role === "ученик") {
        activeStudentProj.querySelector('.proj-info').classList.add('hidden');
        activeStudentProj.querySelector('.proj-status').classList.remove('hidden');
    } else if (role.role === "учитель") {
        activeTeacherProj.querySelector('.proj-info').classList.add('hidden');
        activeTeacherProj.querySelector('.proj-status').classList.remove('hidden');
    }
}

function onSuccessGetProj (res, role) {
    if (role.role === "ученик") {
        activeStudentProj.querySelector('.proj-title').textContent = res[0].topic;
        activeStudentProj.querySelector('.proj-teacher').textContent = 
            `${res[0].last_name_teacher} ${res[0].first_name_teacher} ${res[0].patronymic_teacher}`;
        activeStudentProj.querySelector('#proj-index').textContent = res[0].id;
        activeStudentProj.querySelector('#proj-sphere').textContent = res[0].field_of_activity;
        activeStudentProj.querySelector('#proj-about').textContent = res[0].about;
        activeStudentProj.querySelector('#proj-state').textContent = res[0].state;
    } else if (role.role === "учитель") {
        const projTemplate = document.querySelector('#active-student-project-template')
            .content
            .querySelector('.active-student-proj');
        const projList = document.querySelector('.projects-list');

        res.forEach((activeProject) => {
            const newProj = projTemplate.cloneNode(true);

            newProj.querySelector('.student-name').textContent = 
                `${activeProject.last_name_student} ${activeProject.first_name_student} ${activeProject.patronymic_student}`;
            newProj.querySelector('#proj-index-t').textContent = activeProject.id;
            newProj.querySelector('#proj-sphere-t').textContent = activeProject.field_of_activity;
            newProj.querySelector('#proj-about-t').textContent = activeProject.about;
            newProj.querySelector('#proj-state-t').textContent = activeProject.state;
            newProj.querySelector('#proj-topic-t').textContent = activeProject.topic;
            projList.append(newProj);
        });
        addEventListeners();
    }
}

// переход на страницу проекта
let projInfo;
activeStudentProj.addEventListener('click', () => {
    projInfo = {
        id: activeStudentProj.querySelector('#proj-index').textContent,
        topic: activeStudentProj.querySelector('.proj-title').textContent,
        user: activeStudentProj.querySelector('.proj-teacher').textContent,
        sphere: activeStudentProj.querySelector('#proj-sphere').textContent,
        about: activeStudentProj.querySelector('#proj-about').textContent,
        state: activeStudentProj.querySelector('#proj-state').textContent
    }
    console.log(projInfo);

    const savedData = new URLSearchParams(projInfo).toString();
    window.location.href = `./project-page.html?${savedData}`;
});


function addEventListeners () {
    const activeTeacherProjects = activeTeacherProj.querySelectorAll('.active-student-proj');

    activeTeacherProjects.forEach((project) => {
        project.addEventListener('click', () => {
            projInfo = {
                id: project.querySelector('#proj-index-t').textContent,
                topic: project.querySelector('#proj-topic-t').textContent,
                user: project.querySelector('#stud-name').textContent,
                sphere: project.querySelector('#proj-sphere-t').textContent,
                about: project.querySelector('#proj-about-t').textContent,
                state: project.querySelector('#proj-state-t').textContent
            }
            console.log(projInfo);
        
            const savedData = new URLSearchParams(projInfo).toString();
            window.location.href = `./project-page.html?${savedData}`;
        });
    });
}