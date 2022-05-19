import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

export const firebaseConfig = {
    apiKey: "AIzaSyDYxCOzTTHcxGcitpvzOKSNYp2W4aqatz0",
    authDomain: "to-do-app-75e6e.firebaseapp.com",
    databaseURL: "https://to-do-app-75e6e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "to-do-app-75e6e",
    storageBucket: "to-do-app-75e6e.appspot.com",
    messagingSenderId: "768237899720",
    appId: "1:768237899720:web:0c6803c823785521147afd"
};

export const app = initializeApp(firebaseConfig);
