import { URL_LOGIN } from "./modules/urls.js";
import { getJSONForm, checkEmptyInputs, setTokens } from "./modules/utility.js";
import { postData } from "./modules/requests.js";

const form = document.querySelector('.login-form');

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputs = form.querySelectorAll('.enter-input');
    if (checkEmptyInputs(inputs)) {
        postData(URL_LOGIN, getJSONForm(form), successLogin);
    }
});

function successLogin (res) {
    setTokens(res);
    form.reset();
    window.location.href = './account-student.html';
}