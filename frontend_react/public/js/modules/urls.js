const URL_REG = 'http://127.0.0.1:8000/register/';
const URL_LOGIN = 'http://127.0.0.1:8000/token/';
const URL_PROFILE = 'http://127.0.0.1:8000/profile/';
const URL_CUR_PROJ = "http://127.0.0.1:8000/projects/get-active/";
const URL_EDIT = 'http://127.0.0.1:8000/profile/update/';
const URL_PROJECTS = 'http://127.0.0.1:8000/projects/student-get-projects/';

const URL_DENY_PROJ = 'http://127.0.0.1:8000/projects/teacher-denied-project/'; // + id проекта
const URL_ACCEPT_PROJ = 'http://127.0.0.1:8000/projects/teacher-accept-project/'; // + id проекта
const URL_TAKE_PROJ = 'http://127.0.0.1:8000/projects/student-choose-project/'; // + id проекта

const URL_TEACHERS = 'http://127.0.0.1:8000/about-teacher/all/';
const URL_PROPOSE_PROJ_TEACHER = "http://127.0.0.1:8000/projects/teacher-offers-project/";
const URL_PROPOSE_PROJ_STUDENT = "http://127.0.0.1:8000/projects/student-offers-project/";
const URL_STUDENT_PROJECTS = "http://127.0.0.1:8000/projects/teacher-viewing-proposed-projects/";

const URL_GET_CARDS = `http://127.0.0.1:8000/getcards/`; // + id проекта
const URL_OPEN_CARD = 'http://127.0.0.1:8000/card/';

export {
    URL_LOGIN, URL_REG, URL_PROFILE, URL_CUR_PROJ, 
    URL_EDIT, URL_PROJECTS, URL_DENY_PROJ, URL_ACCEPT_PROJ, 
    URL_TAKE_PROJ, URL_TEACHERS, URL_PROPOSE_PROJ_TEACHER,
    URL_PROPOSE_PROJ_STUDENT, URL_STUDENT_PROJECTS,
    URL_GET_CARDS, URL_OPEN_CARD
};