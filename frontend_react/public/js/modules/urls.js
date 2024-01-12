const SERVER = 'http://127.0.0.1:8000'; // http://185.199.11.193

const URL_REG = `${SERVER}/register/`;
const URL_LOGIN = `${SERVER}/token/`;
const URL_PROFILE = `${SERVER}/profile/`;
const URL_CUR_PROJ = `${SERVER}/projects/get-active/`;
const URL_EDIT = `${SERVER}/profile/update/`;
const URL_PROJECTS = `${SERVER}/projects/student-get-projects/`;

const URL_DENY_PROJ = `${SERVER}/projects/teacher-denied-project/`; // + id проекта
const URL_ACCEPT_PROJ = `${SERVER}/projects/teacher-accept-project/`; // + id проекта
const URL_TAKE_PROJ = `${SERVER}/projects/student-choose-project/`; // + id проекта
const URL_COMPLETE_PROJ = `${SERVER}/projects/complete/`; // + id проекта

const URL_TEACHERS = `${SERVER}/about-teacher/all/`;
const URL_PROPOSE_PROJ_TEACHER = `${SERVER}/projects/teacher-offers-project/`;
const URL_PROPOSE_PROJ_STUDENT = `${SERVER}/projects/student-offers-project/`;
const URL_STUDENT_PROJECTS = `${SERVER}/projects/teacher-viewing-proposed-projects/`;

const URL_GET_CARDS = `${SERVER}/getcards/`; // + id проекта
const URL_OPEN_CARD = `${SERVER}/card/`;

const URL_GET_COMMENTS = `${SERVER}/comments/`;
const URL_CREATE_COMMENT = `${SERVER}/comments/create/`;
const URL_GET_COMPLETED_PROJ = `${SERVER}/projects/get-completed/`;

export {
    URL_LOGIN, URL_REG, URL_PROFILE, URL_CUR_PROJ, 
    URL_EDIT, URL_PROJECTS, URL_DENY_PROJ, URL_ACCEPT_PROJ, URL_COMPLETE_PROJ,  
    URL_TAKE_PROJ, URL_TEACHERS, URL_PROPOSE_PROJ_TEACHER,
    URL_PROPOSE_PROJ_STUDENT, URL_STUDENT_PROJECTS,
    URL_GET_CARDS, URL_OPEN_CARD, URL_GET_COMPLETED_PROJ,
    URL_CREATE_COMMENT, URL_GET_COMMENTS
};