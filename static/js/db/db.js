import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

import {
    getDatabase,
    onChildAdded,
    onChildChanged,
    onValue,
    orderByChild,
    push,
    query,
    ref,
    update,
    startAt,
    onChildRemoved,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

import {List, Note} from "./entities.js";

import {addNoteElement, changeNoteElement, removeNoteElement} from "../main/domManipulation.js";

const firebaseConfig = {
    apiKey: "AIzaSyDYxCOzTTHcxGcitpvzOKSNYp2W4aqatz0",
    authDomain: "to-do-app-75e6e.firebaseapp.com",
    databaseURL: "https://to-do-app-75e6e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "to-do-app-75e6e",
    storageBucket: "to-do-app-75e6e.appspot.com",
    messagingSenderId: "768237899720",
    appId: "1:768237899720:web:0c6803c823785521147afd"
};

const initTime = Date.now();

class MyDatabase {
    constructor() {
        const app = initializeApp(firebaseConfig);
        this.db = getDatabase(app);
        onChildAdded(query(ref(this.db, 'notes/'), orderByChild('timestamp'), startAt(initTime)), (snapshot) => {
            addNoteElement(snapshot.key, snapshot.val());
        });
        onChildChanged(ref(this.db, 'notes/'), (snapshot) => {
            changeNoteElement(snapshot.key, snapshot.val());
        });
        onChildRemoved(ref(this.db, 'notes/'), (snapshot) => {
            removeNoteElement(snapshot.key);
        });
    }

    addNote(title, content, timestamp, type, tag, pinned) {
        push(ref(this.db, 'notes/'), {
            title: title,
            content: content,
            timestamp: timestamp,
            type: type,
            tag: tag,
            pinned: pinned
        });
    }

    updateNote(key, title, content, timestamp, type, tag, pinned, listItems={}) {
        if (type === "note") {
            update(ref(this.db, 'notes/' + key), {
                title: title,
                content: content,
                timestamp: timestamp,
                type: type,
                tag: tag,
                pinned: pinned
            });
        } else if (type === "list") {
            update(ref(this.db, 'notes/' + key), {
                title: title,
                content: content,
                timestamp: timestamp,
                type: type,
                tag: tag,
                pinned: pinned,
                listItems: listItems
            });
        }
    }

    updateNotePinned(key, pinned) {
        update(ref(this.db, 'notes/' + key), {
            pinned: pinned
        });
    }

    updateNoteListItem(key, listItemValue, listItemKey) {
        const path = 'notes/' + key + '/listItems/' + listItemKey;
        update(ref(this.db, path), {
            checked: listItemValue
        });
    }

    getNotes() {
        const notesRef = query(ref(this.db, 'notes/'), orderByChild('pinned'));
        return new Promise((resolve, reject) => {
            onValue(notesRef, (snapshot) => {
                if (snapshot.val() == null) {
                    reject('No notes found');
                } else {
                    const notes = [];
                    snapshot.forEach((childSnapshot) => {
                        const content = childSnapshot.val();
                        if (content.type === 'note') {
                            notes.push(
                                new Note(
                                    childSnapshot.key,
                                    content.title,
                                    content.timestamp,
                                    content.type,
                                    content.tag,
                                    content.pinned,
                                    content.content
                                )
                            );
                        } else if (content.type === 'list') {
                            notes.push(
                                new List(
                                    childSnapshot.key,
                                    content.title,
                                    content.timestamp,
                                    content.type,
                                    content.tag,
                                    content.pinned,
                                    content.listItems
                                )
                            );
                        }
                    });
                    resolve(notes);
                }
            });
        });
    }
}

export var db = new MyDatabase();
