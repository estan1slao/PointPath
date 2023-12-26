const questionsList = document.querySelectorAll('.question-item');

questionsList.forEach((item) => {
    const questionWrapper = item.querySelector('.question-wrapper');
    const image = questionWrapper.querySelector('img');
    const answer = item.querySelector('.answer');

    questionWrapper.addEventListener('click', () => {
        answer.classList.toggle('hidden');
        questionWrapper.classList.toggle('open');
        if (questionWrapper.classList.contains('open')) {
            image.src = "./img/cross-rotate.svg";
        } else {
            image.src = "./img/cross.svg";
        }
        
    })
})

