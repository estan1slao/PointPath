const URL_REG = 'http://185.199.11.193/register/';
const URL_LOGIN = 'http://185.199.11.193/token/';
const URL_PROFILE = 'http://185.199.11.193/profile/';
const URL_CUR_PROJ = "http://185.199.11.193/projects/get-active/";
const URL_EDIT = 'http://185.199.11.193/profile/update/';
const URL_PROJECTS = 'http://185.199.11.193/projects/student-get-projects/';

const URL_DENY_PROJ = 'http://185.199.11.193/projects/teacher-denied-project/'; // + id проекта
const URL_ACCEPT_PROJ = 'http://185.199.11.193/projects/teacher-accept-project/'; // + id проекта
const URL_TAKE_PROJ = 'http://185.199.11.193/projects/student-choose-project/'; // + id проекта

const URL_TEACHERS = 'http://185.199.11.193/about-teacher/all/';
const URL_PROPOSE_PROJ_TEACHER = "http://185.199.11.193/projects/teacher-offers-project/";
const URL_PROPOSE_PROJ_STUDENT = "http://185.199.11.193/projects/student-offers-project/";
const URL_STUDENT_PROJECTS = "http://185.199.11.193/projects/teacher-viewing-proposed-projects/";

const URL_GET_CARDS = `http://185.199.11.193/getcards/`; // + id проекта
const URL_OPEN_CARD = 'http://185.199.11.193/card/';

const URL_GET_COMMENTS = 'http://185.199.11.193/comments/';
const URL_CREATE_COMMENT = 'http://185.199.11.193/comments/create/';

export {
    URL_LOGIN, URL_REG, URL_PROFILE, URL_CUR_PROJ, 
    URL_EDIT, URL_PROJECTS, URL_DENY_PROJ, URL_ACCEPT_PROJ, 
    URL_TAKE_PROJ, URL_TEACHERS, URL_PROPOSE_PROJ_TEACHER,
    URL_PROPOSE_PROJ_STUDENT, URL_STUDENT_PROJECTS,
    URL_GET_CARDS, URL_OPEN_CARD,
    URL_CREATE_COMMENT, URL_GET_COMMENTS
};