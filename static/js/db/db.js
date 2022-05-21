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
    get,
    child,
    remove,
    equalTo,
    set,
    limitToFirst,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

import {List, Note, Reminder} from "./entities.js";

import {
    drawNoteElement,
    drawTagElement,
    changeNoteElement,
    removeNoteElementById,
    addReminderElement,
    removeReminderElement,
    changeReminderElement
} from "../main/domManipulation.js";

import {app} from "../config.js";

const initTime = Date.now();

class MyDatabase {
    constructor() {
        this.db = getDatabase(app);
        onChildAdded(query(ref(this.db, `${sessionStorage.getItem('userId')}/notes/`), orderByChild('timestamp'), startAt(initTime)), (snapshot) => {
            drawNoteElement(snapshot.key, snapshot.val());
        });
        onChildChanged(ref(this.db, `${sessionStorage.getItem('userId')}/notes/`), (snapshot) => {
            changeNoteElement(snapshot.key, snapshot.val());
        });
        onChildRemoved(ref(this.db, `${sessionStorage.getItem('userId')}/notes/`), (snapshot) => {
            removeNoteElementById(snapshot.key);
        });
        onChildAdded(ref(this.db, `${sessionStorage.getItem('userId')}/tags/`), (snapshot) => {
            drawTagElement(snapshot.key);
        });
        onChildAdded(query(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/`), orderByChild('timestamp'), startAt(initTime)), (snapshot) => {
            addReminderElement(snapshot.key, snapshot.val());
        });
        onChildRemoved(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/`), (snapshot) => {
            removeReminderElement(snapshot.key);
        });
        onChildChanged(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/`), (snapshot) => {
            changeReminderElement(snapshot.key, snapshot.val());
        });
    }

    getLastTwoReminders() {
        return new Promise((resolve, reject) => {
            const reminders = [];
            get(query(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/`), orderByChild('eventTimestamp'), limitToFirst(2))).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        reminders.push(
                            new Reminder(
                                childSnapshot.key,
                                childSnapshot.val().content,
                                childSnapshot.val().eventTimestamp,
                                childSnapshot.val().timestamp
                            )
                        );
                    });
                    resolve(reminders);
                } else {
                    reject('No reminders found');
                }
            });
        });
    }

    getReminders() {
        return new Promise((resolve, reject) => {
            const reminders = [];
            get(query(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/`)), orderByChild('eventTimestamp')).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        reminders.push(
                            new Reminder(
                                childSnapshot.key,
                                childSnapshot.val().content,
                                childSnapshot.val().eventTimestamp,
                                childSnapshot.val().timestamp
                            )
                        );
                    });
                    resolve(reminders);
                } else {
                    reject('No reminders found');
                }
            });
        });
    }

    addReminder(content, eventTimestamp) {
        push(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/`), {
            content: content,
            eventTimestamp: eventTimestamp,
            timestamp: Date.now()
        });
    }

    updateReminder(id, content, eventTimestamp) {
        update(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/${id}`), {
            content: content,
            eventTimestamp: eventTimestamp,
            timestamp: Date.now()
        });
    }

    removeReminder(id) {
        remove(ref(this.db, `reminders/${id}`));
    }

    getReminderByKey(key) {
        return new Promise((resolve, reject) => {
            get(ref(this.db, `${sessionStorage.getItem('userId')}/reminders/${key}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    resolve(
                        new Reminder(
                            snapshot.key,
                            snapshot.val().content,
                            snapshot.val().eventTimestamp,
                            snapshot.val().timestamp
                        )
                    );
                } else {
                    reject('No reminder found');
                }
            });
        });
    }

    setTag(tag) {
        set(ref(this.db, `${sessionStorage.getItem('userId')}/tags/${tag}`), "");
    }

    removeTag(tag) {
        remove(ref(this.db, `${sessionStorage.getItem('userId')}/tags/${tag}`));
    }

    addNote(title, tag, timestamp, type, pinned, content = null, listItems = [], image = null) {
        let newPostRef = null;
        if (type === 'note') {
            newPostRef = push(ref(this.db, `${sessionStorage.getItem('userId')}/notes/`), {
                title: title,
                content: content,
                timestamp: timestamp,
                type: type,
                tag: tag,
                pinned: pinned,
            });
        } else if (type === 'list') {
            newPostRef = push(ref(this.db, `${sessionStorage.getItem('userId')}/notes/`), {
                title: title,
                timestamp: timestamp,
                type: type,
                tag: tag,
                pinned: pinned,
                listItems: listItems,
            });
        }
        if (tag !== "") {
            this.setTag(tag);
        }
        if (image) {
            this.base64encodeImage(image).then(base64 => {
                image = base64;
                set(ref(this.db, `${sessionStorage.getItem('userId')}/notes/${newPostRef.key}/image`), image);
            });
        }
    }

    updateNote(key, title, type, timestamp, pinned, tag, content = "", listItems = {}, image = null) {
        if (type === "note") {
            update(ref(this.db, `${sessionStorage.getItem('userId')}/notes/` + key), {
                title: title,
                content: content,
                timestamp: timestamp,
                type: type,
                tag: tag,
                pinned: pinned,
            });
        } else if (type === "list") {
            update(ref(this.db, `${sessionStorage.getItem('userId')}/notes/` + key), {
                title: title,
                timestamp: timestamp,
                type: type,
                tag: tag,
                pinned: pinned,
                listItems: listItems,
            });
        }
        if (tag !== "") {
            this.setTag(tag);
        }
        if (image) {
            this.base64encodeImage(image).then(base64 => {
                image = base64;
                set(ref(this.db, `${sessionStorage.getItem('userId')}/notes/${key}/image`), image);
            });
        }
    }

    updateNotePinned(key, pinned) {
        update(ref(this.db, `${sessionStorage.getItem('userId')}/notes/` + key), {
            pinned: pinned
        });
    }

    getNoteByKey(key) {
        const dbRef = ref(this.db);
        return new Promise((resolve, reject) => {
            get(child(dbRef, `${sessionStorage.getItem('userId')}/notes/${key}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.val().type === 'note') {
                        const note = new Note(
                            snapshot.key,
                            snapshot.val().title,
                            snapshot.val().timestamp,
                            snapshot.val().type,
                            snapshot.val().tag,
                            snapshot.val().pinned,
                            snapshot.val().content
                        );
                        resolve(note);
                    } else {
                        const list = new List(
                            snapshot.key,
                            snapshot.val().title,
                            snapshot.val().timestamp,
                            snapshot.val().type,
                            snapshot.val().tag,
                            snapshot.val().pinned,
                            snapshot.val().listItems
                        );
                        resolve(list);
                    }
                } else {
                    reject("Couldn't find note with key: " + key);
                }
            });
        });
    }

    getNotes() {
        const notesRef = query(ref(this.db, `${sessionStorage.getItem('userId')}/notes/`), orderByChild('pinned'));
        return this.getNotesPromiseByRef(notesRef);
    }

    getNotesByTag(tag) {
        const notesRef = query(ref(this.db, `${sessionStorage.getItem('userId')}/notes/`), orderByChild('tag'), equalTo(tag));
        return this.getNotesPromiseByRef(notesRef);
    }

    removeNote(key) {
        remove(ref(this.db, `${sessionStorage.getItem('userId')}/notes/` + key));
    }

    getNotesPromiseByRef(notesRef) {
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
                                    content.content,
                                    content.image
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
                                    content.listItems,
                                    content.image
                                )
                            );
                        }
                    });
                    resolve(notes);
                }
            });
        });
    }

    base64encodeImage(image) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    }
}

export var db = new MyDatabase();
