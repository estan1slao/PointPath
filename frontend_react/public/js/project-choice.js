// Логика для вкладок header
import { getData } from "./modules/requests.js";
import { getTokens } from "./modules/utility.js";
import { URL_PROFILE } from "./modules/urls.js";

const tokens = getTokens();

getData(URL_PROFILE, tokens.access, fillData);

function fillData (data) {
    const proposeProjectTab = document.querySelector('#propose-project');
    const fi = document.querySelector('#fi');

    if (data.role === "ученик") { 
        proposeProjectTab.classList.add('hidden');
        
        fi.textContent = `${data.last_name} ${data.first_name}`;
    }    
}