const archiveProjectsPopup = document.querySelector('.archive-student-projects').closest('.popup');
const archiveProjectsArea = document.querySelector('.archive-projects');

function archiveProjectsAreaHandler (evt) {
    evt.preventDefault();
    archiveProjectsPopup.classList.remove('hidden');
    
    const closeBtn = archiveProjectsPopup.querySelector('.close-btn');

    closeBtn.addEventListener('click', closeHandlerArchPr);
}

function closeHandlerArchPr (evt) {
    evt.preventDefault();
    archiveProjectsPopup.classList.add('hidden');
}

archiveProjectsArea.addEventListener('click', archiveProjectsAreaHandler);
