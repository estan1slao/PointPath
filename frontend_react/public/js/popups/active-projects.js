const activeProjectsPopup = document.querySelector('.active-student-projects').closest('.popup');
const activeProjectsArea = document.querySelector('.active-projects-t');

function closeBtnHandlerActivePr () {
    activeProjectsPopup.classList.add('hidden');
    this.removeEventListener('click', closeBtnHandlerActivePr);
}

function activeProjectsAreaHandler () {
    activeProjectsPopup.classList.remove('hidden');

    const closeBtn = activeProjectsPopup.querySelector('.close-btn');

    closeBtn.addEventListener('click', closeBtnHandlerActivePr);
}

activeProjectsArea.addEventListener('click', activeProjectsAreaHandler)