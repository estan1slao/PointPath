import { URL_PROFILE } from "./modules/urls.js";
import { getData } from "./modules/requests.js";
import { getTokens } from "./modules/utility.js";

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

// Логика для вкладок header
const tokens = getTokens();

getData(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const projectTab = document.querySelector('#project');
    const trajectoryTab = document.querySelector('#trajectory');
    const projectsToApproveTab = document.querySelector('#projects-to-approve');
    const proposeProjectTab = document.querySelector('#propose-project');
    const enterTab = document.querySelector('#enter');
    const createAccountTab = document.querySelector('#create-account');
    const fi = document.querySelector('#fi');
    const accountTab = document.querySelector('.account');

    if (data.role === "ученик") { 
        projectTab.classList.remove('hidden');
        trajectoryTab.classList.remove('hidden');
        enterTab.classList.add('hidden');
        createAccountTab.classList.add('hidden');
        accountTab.classList.remove('hidden');
        
        fi.textContent = `${data.last_name} ${data.first_name}`;
    }
    else {
        proposeProjectTab.classList.add('hidden');
        projectsToApproveTab.classList.remove('hidden');
        enterTab.classList.add('hidden');
        createAccountTab.classList.add('hidden');
        accountTab.classList.remove('hidden');

        fi.textContent = `${data.last_name} ${data.first_name} ${data.patronymic}`;
    }
    
}

//свайпер

const slider = document.querySelector('.slider-block');
const sliderList = slider.querySelector('.slider-list');
const sliderTrack = slider.querySelector('.slider-track');
const slides = slider.querySelectorAll('.slider-item');
const arrows = slider.querySelector('.slider-arrows');
const prev = arrows.children[0];
const next = arrows.children[1];

sliderTrack.style.transform = `translate3d(0px, 0px, 0px)`;
sliderList.classList.add('grab');

let slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/;

const getEvent = function() {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
};

const slide = function() {
    if (transition) {
        sliderTrack.style.transition = 'transform .5s';
    }
    sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

    prev.classList.toggle('disabled', slideIndex === 0);
    next.classList.toggle('disabled', slideIndex === --slides.length);
};

const swipeStart = function() {
    let evt = getEvent();

    if (allowSwipe) {

        transition = true;

        nextTrf = (slideIndex + 1) * -slideWidth;
        prevTrf = (slideIndex - 1) * -slideWidth;

        posInit = posX1 = evt.clientX;
        posY1 = evt.clientY;

        sliderTrack.style.transition = '';

        document.addEventListener('touchmove', swipeAction);
        document.addEventListener('mousemove', swipeAction);
        document.addEventListener('touchend', swipeEnd);
        document.addEventListener('mouseup', swipeEnd);

        sliderList.classList.remove('grab');
        sliderList.classList.add('grabbing');
    }
};

const swipeAction = function() {
    let evt = getEvent(),
      style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    // определение действия свайп или скролл
    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      // запрет ухода влево на первом слайде
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (slideIndex === --slides.length) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет протаскивания дальше одного слайда
      if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
        reachEdge();
        return;
      }

      // двигаем слайд
      sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
    }
  };

const swipeEnd = function() {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);

    sliderList.classList.add('grab');
    sliderList.classList.remove('grabbing');

    if (allowSwipe) {
      if (Math.abs(posFinal) > posThreshold) {
        if (posInit < posX1) {
          slideIndex--;
        } else if (posInit > posX1) {
          slideIndex++;
        }
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }

    } else {
      allowSwipe = true;
    }
  };

const setTransform = function(transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  };
  
const reachEdge = function() {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
slider.addEventListener('touchstart', swipeStart);
slider.addEventListener('mousedown', swipeStart);

arrows.addEventListener('click', function(evt) {
  let target = evt.target;

  if (target.classList.contains('next')) {
    slideIndex++;
  } else if (target.classList.contains('prev')) {
    slideIndex--;
  } else {
    return;
  }

  slide();
});