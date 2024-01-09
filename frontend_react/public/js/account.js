import { getTokens, getJSONForm, projectClickHandler } from "./modules/utility.js";
import { URL_PROFILE, URL_CUR_PROJ, URL_EDIT } from "./modules/urls.js";
import { getData, editData, getCurrentProjData } from "./modules/requests.js";

const fio = document.querySelector('#fio');
const fi = document.querySelector('#fi');
const email = document.querySelector('#email');
const grade = document.querySelector('#specification');
const tg = document.querySelector('#tg');
const vk = document.querySelector('#vk');
const phone = document.querySelector('#phone');
const about = document.querySelector('.skills-text');

const tokens = getTokens();

getData(URL_PROFILE, tokens.access, fillData);

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
const closeInputBtn = form.querySelectorAll('.close-input-btn');

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

    closeInputBtn.forEach((item) => {
        item.addEventListener('click', closeInputHandler);
    })
    closeEditButton.addEventListener('click', closeEditForm);
}

editButton.addEventListener('click', () => {
    openEditPopup();
});

function closeInputHandler (evt) {
    evt.currentTarget.closest('.input-wrapper').querySelector('input').value = '';
} 

function closeEditForm () {
    editPopupWrapper.classList.add('hidden');
    closeEditButton.removeEventListener('click', closeEditForm);
    closeInputBtn.forEach((item) => {
        item.removeEventListener('click', closeInputHandler);
    })
}

function reloadPage () {
    document.location.reload();
};


// редактирование (логика)

const noContactsLabel = document.querySelector('.no-contacts');
const saveEditButton = form.querySelector('.save-button');

function blockSubmitBtn () {
    saveEditButton.disabled = true;
};

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    blockSubmitBtn();
    editData(URL_EDIT, tokens.access, getJSONForm(form), reloadPage);
})

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

    getCurrentProjData(URL_CUR_PROJ, tokens.access, onSuccessGetProj, onErrorGetProj, data.role);
}

// получить инфу о текущем проекте

const activeStudentProj = document.querySelector('.active-projects-s');
const activeTeacherProj = document.querySelector('.active-projects-t');

function onErrorGetProj (role) {
    if (role === "ученик") {
        activeStudentProj.querySelector('.proj-info').classList.add('hidden');
        activeStudentProj.querySelector('.proj-status').classList.remove('hidden');
    } else if (role === "учитель") {
        activeTeacherProj.querySelector('.proj-info').classList.add('hidden');
        activeTeacherProj.querySelector('.proj-status').classList.remove('hidden');
    }
}

function onSuccessGetProj (res, role) {
    if (role === "ученик") {
        activeStudentProj.querySelector('.proj-title').textContent = res[0].topic;
        activeStudentProj.querySelector('.proj-teacher').textContent = 
            `${res[0].last_name_teacher} ${res[0].first_name_teacher} ${res[0].patronymic_teacher}`;
        activeStudentProj.querySelector('#proj-index').textContent = res[0].id;
        activeStudentProj.querySelector('#proj-sphere').textContent = res[0].field_of_activity;
        activeStudentProj.querySelector('#proj-about').textContent = res[0].about;
        activeStudentProj.querySelector('#proj-state').textContent = res[0].state;

    } else if (role === "учитель") {
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
activeStudentProj.addEventListener('click', () => {
    const activeStudentProject = document.querySelector('.active-projects-s');
 
    const transferData = projectClickHandler(
        activeStudentProject.querySelector('#proj-index').textContent,
        activeStudentProject.querySelector('.proj-title').textContent,
        activeStudentProject.querySelector('.proj-teacher').textContent,
        activeStudentProject.querySelector('#proj-sphere').textContent,
        activeStudentProject.querySelector('#proj-about').textContent,
        activeStudentProject.querySelector('#proj-state').textContent
    )
    transferData();
});

function addEventListeners () {
    const activeTeacherProjects = activeTeacherProj.querySelectorAll('.active-student-proj');

    activeTeacherProjects.forEach((project) => {
        project.addEventListener('click', projectClickHandler(
            project.querySelector('#proj-index-t').textContent,
            project.querySelector('#proj-topic-t').textContent,
            project.querySelector('#stud-name').textContent,
            project.querySelector('#proj-sphere-t').textContent,
            project.querySelector('#proj-about-t').textContent,
            project.querySelector('#proj-state-t').textContent
        ));
    });
}