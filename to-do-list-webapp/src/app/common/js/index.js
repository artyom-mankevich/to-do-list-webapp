import {auth} from "./auth/auth.js";

setGetStartedButtonListeners();

function setGetStartedButtonListeners() {
    const getStartedButton = document.querySelector('.main-panel__start-button');
    getStartedButton.addEventListener('click', () => {
        if (auth.user) {
            window.location.replace('templates/main.html');
        } else {
            window.location.replace('templates/login.html');
        }
    });
}
