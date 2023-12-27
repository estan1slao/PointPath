const dropdownList = document.querySelectorAll('.custom-select');

dropdownList.forEach((dropdown) => {
    const dropdownButton = dropdown.querySelector('.dropdown__button');
    const dropdownList = dropdown.querySelector('.dropdown-list');
    const dropdownItems = dropdownList.querySelectorAll('.dropdown-list-item');
    const input = dropdown.querySelector('.dropdown-input');

    function clickButton (evt) {
        evt.preventDefault();
        dropdownList.classList.toggle('hidden');
        dropdownButton.classList.toggle('dropdown-list__opened');
        document.addEventListener('click', clickOutsideDropdown);
        document.addEventListener('keydown', keyDown);
    }

    dropdownButton.addEventListener('click', clickButton);

    function clickItem () {
        dropdownButton.innerText = this.innerText;
        // input.value = this.dataset.value;
        input.value = this.innerText;
        closeDropdown();
    }

    dropdownItems.forEach(function (item) {
        item.addEventListener('click', clickItem)
    });

    function closeDropdown () {
        dropdownList.classList.add('hidden');
        dropdownButton.classList.remove('dropdown-list__opened');
        document.removeEventListener('click', clickOutsideDropdown);
        document.removeEventListener('keydown', keyDown);
    }

    function clickOutsideDropdown (evt) {
        const click = evt.composedPath();
    
        if (!click.includes(dropdownButton) && !dropdownList.classList.contains('hidden')) {
            closeDropdown();
        }
    }

    function keyDown (evt) {
        if (evt.key === 'Tab' || evt.key === 'Escape') {
            closeDropdown();
        }
    }
});


// внешний вид, в зависимости от роли
const URL_PROFILE = 'http://127.0.0.1:8000/profile/';

function getDataLogin (url, token, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Ошибка 1');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('Ошибка 2');
    });
}

function getTokens () {
    const cookies = document.cookie.split('; ');

    cookies.forEach((token) => {
        const [name, value] = token.split('=');
        if (name === 'access') {
            tokens.access = value;
        } else if (name === 'refresh') {
            tokens.refresh = value;
        }
    })
}

const tokens = {};
getTokens();

getDataLogin(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const projectTab = document.querySelector('#project');
    const trajectoryTab = document.querySelector('#trajectory');
    const projectsToApproveTab = document.querySelector('#projects-to-approve');
    const proposeProjectTab = document.querySelector('#propose-project');

    const fi = document.querySelector('#fi');

    const title = document.querySelector('.title');
    const teacherSelect = document.querySelector('.teacher-select');
    const submitButton = document.querySelector('.submit-button');

    if (data.role === "учитель") {
        projectTab.classList.add('hidden');
        trajectoryTab.classList.add('hidden');
        projectsToApproveTab.classList.remove('hidden');
        proposeProjectTab.classList.remove('hidden');

        title.textContent = ".добавить проект в каталог";
        teacherSelect.classList.add('hidden');
        submitButton.textContent = "добавить проект";
    }

    fi.textContent = `${data.last_name} ${data.first_name}`;
}

// отправить проект
const URL_PROPOSE_PROJ = "http://127.0.0.1:8000/projects/teacher-offers-project/";
const form = document.querySelector('.block-form');

function postDataProj (url, token, data, onSuccess) {
    fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        body: data,
    },
    )
    .then((response) => {
        if (response.ok) {
            onSuccess();
        } else {
            console.log('Ошибка 3');
        }
    })
    .catch(() => {
        console.log('Ошибка 4');
    });
}

function checkEmptyInputs (inputs) {
    let flag = true;

    inputs.forEach((input) => {
        if (input.value === "" && input.name !== "teacher") {
            flag = false;
        }
    })
    return flag;
}

function getJSONForm (formValues) {
    const formData = new FormData(formValues);
    let object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    return JSON.stringify(object);
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputs = form.querySelectorAll('input');
    if (checkEmptyInputs(inputs)) {
        postDataProj(URL_PROPOSE_PROJ, tokens.access, getJSONForm(form), console.log);
    }
})

function onSuccesPostProj () {

}