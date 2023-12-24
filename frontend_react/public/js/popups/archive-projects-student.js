const archiveProjectsPopup = document.querySelector('.archive-student-projects').closest('.popup');
const archiveProjectsArea = document.querySelector('.archive-projects');

function closeHandler (evt) {
    evt.preventDefault();
    archiveProjectsPopup.classList.add('hidden');

    closeBtn.removeEventListener('click', closeHandler);
}

function archiveProjectsAreaHandler (evt) {
    evt.preventDefault();
    archiveProjectsPopup.classList.remove('hidden');

    const closeBtn = archiveProjectsPopup.querySelector('.close-btn');

    closeBtn.addEventListener('click', closeHandler);
}

archiveProjectsArea.addEventListener('click', archiveProjectsAreaHandler);
