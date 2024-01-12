const archiveProjectsPopupT = document.querySelector('.archive-students-projects').closest('.popup');
const archiveProjectsAreaT = document.querySelector('.archive-projects-t').querySelector('.more');

function archiveProjectsAreaHandlerT (evt) {
    evt.preventDefault();
    archiveProjectsPopupT.classList.remove('hidden');
    
    const closeBtn = archiveProjectsPopupT.querySelector('.close-btn');

    closeBtn.addEventListener('click', closeHandlerArchPrT);
}

function closeHandlerArchPrT (evt) {
    evt.preventDefault();
    archiveProjectsPopupT.classList.add('hidden');
}

archiveProjectsAreaT.addEventListener('click', archiveProjectsAreaHandlerT);
