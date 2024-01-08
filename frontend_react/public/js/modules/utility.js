function checkEmptyInputs (inputs) {
    let flag = true;
    inputs.forEach((input) => {
        if (input.value === "") {
            flag = false;
        }
    })
    return flag;
}

function getJSONForm (formValues) {
    const formData = new FormData(formValues);
    let object = {};
    formData.forEach((value, key) => {
        if (key === 'grade') { 
            object['info'] = {
                grade: value
            }
        } else if (key === 'discipline') {
            object['info'] = {
                discipline: value
            }
        } else {
            object[key] = value;
        }
    });
    return JSON.stringify(object);
}

function setTokens (res) {
    document.cookie = "access=" + encodeURIComponent(res.access) + "; expires=дата_истечения; path=/";
    document.cookie = "refresh=" + encodeURIComponent(res.refresh) + "; expires=дата_истечения; path=/";
}

function getTokens () {
    const TOKENS = {};
    const cookies = document.cookie.split('; ');

    cookies.forEach((token) => {
        const [name, value] = token.split('=');
        if (name === 'access') {
            TOKENS.access = value;
        } else if (name === 'refresh') {
            TOKENS.refresh = value;
        }
    })
    return TOKENS;
}

// сохраняем данные, чтобы перенести их на страницу проекта
function projectClickHandler (idData, topicData, userData, sphereData, aboutData, stateData, studentIdData) {
    return function () {
        const projInfo = {
            id: idData,
            topic: topicData,
            user: userData,
            sphere: sphereData,
            about: aboutData,
            state: stateData,
            studentId: studentIdData
        }
    
        const savedData = new URLSearchParams(projInfo).toString();
        window.location.href = `./project-page.html?${savedData}`;
    }
}

export { checkEmptyInputs, getJSONForm, setTokens, getTokens, projectClickHandler };