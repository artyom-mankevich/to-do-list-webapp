import {setEmailEventListeners, setPassword1EventListeners} from "./common.js";
import {validateEmail, validatePassword} from "./validation.js";
import {auth} from "./auth.js";

setEventListeners();

function setEventListeners() {
    setEmailEventListeners();
    setPassword1EventListeners();
    setSubmitListeners();
    const authSection = document.querySelector('.header-auth');
    if (sessionStorage.getItem('userId')) {
        authSection.innerHTML = `<a class="header-auth__item" href="../index.html">
            <img class="header-logo__icon" src="../static/img/logout.svg"
                 alt="Logout icon">
            Log out
        </a>`;
    } else {
        authSection.innerHTML = `<a class="header-auth__item" href="login.html">Log in</a>
        <a class="header-auth__item" href="templates/signup.html">Sign Up</a>`;
    }
}

function setSubmitListeners() {
    const submitButton = document.querySelector('.card__submit');
    submitButton.addEventListener('click', (event) => {
        const email = document.querySelector('#emailInput').value;
        const password = document.querySelector('#password1Input').value;
        if (validateAllInputs()) {
            auth.signInWithEmailAndPassword(email, password).then(value => {
                if (value) {
                    window.location.replace("/templates/main.html");
                }
            }).catch(() => {
                const authError = document.querySelector('#authError');
                if (!authError.classList.contains('input-error_active')) {
                    authError.classList.add('input-error_active');
                }
            })
        }
    });
}

function validateAllInputs() {
    const email = document.querySelector('#emailInput').value;
    const password = document.querySelector('#password1Input').value;

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (emailValid && passwordValid) {
        return true;
    }

    if (!emailValid) {
        const emailError = document.querySelector('#emailError');
        if (!emailError.classList.contains('input-error_active')) {
            emailError.classList.add('input-error_active');
        }
    }
    if (!password1Valid) {
        const password1Error = document.querySelector('#password1Error');
        if (!password1Error.classList.contains('input-error_active')) {
            password1Error.classList.add('input-error_active');
        }
    }
    return false;
}
