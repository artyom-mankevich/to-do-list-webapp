import {drawNotes} from "./domManipulation.js";
import {setEventListeners} from "./eventListeners.js";

checkAuth();
drawNotes();
setEventListeners();


function checkAuth() {
    if (sessionStorage.getItem('userId') == null) {
        window.location.replace('/to-do-list-webapp/templates/login.html');
    }
}
