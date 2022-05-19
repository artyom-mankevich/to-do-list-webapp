import {drawNotes} from "./domManipulation.js";
import {setEventListeners} from "./eventListeners.js";

checkAuth();
drawNotes();
setEventListeners();


function checkAuth() {
    if (sessionStorage.getItem('userId') == null) {
        window.location.replace('../templates/login.html');
    }
}
