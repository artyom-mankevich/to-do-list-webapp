setGetStartedButtonListeners();

function setGetStartedButtonListeners() {
    const getStartedButton = document.querySelector('.main-panel__start-button');
    getStartedButton.addEventListener('click', () => {
        console.log(sessionStorage.getItem('userId'));
        if (sessionStorage.getItem('userId') != "null") {
            window.location.replace('/to-do-list-webapp/templates/main.html');
        } else {
            window.location.replace('/to-do-list-webapp/templates/login.html');
        }
    });
}


