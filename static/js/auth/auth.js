import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"

class Authenticator {
    constructor() {
        this.auth = getAuth();

        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                sessionStorage.setItem('userId', user.uid);
            } else {
                sessionStorage.setItem('userId', null);
            }
        });
    }

    createUserWithEmailAndPassword(email, password) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(this.auth, email, password).then(() => {
                resolve(true);
            }).catch(() => {
                reject(false);
            });
        });
    }

    signInWithEmailAndPassword(email, password) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(this.auth, email, password).then((user) => {
                resolve(true);
            }).catch(() => {
                reject(false);
            })
        });
    }

    signOut() {
        signOut(this.auth).then(() => {
            sessionStorage.setItem('userId', null);
        }).catch((error) => {
            alert("User logout failed");
        });
    }
}

export const auth = new Authenticator();
