import {db} from "../db/db.js";
import {createFormListItem, insertNoteFormBody} from "./domManipulation.js";
import {addNoteFormListItemListeners} from "./eventListeners.js";

export function addReminderToDb() {
    const content = document.querySelector(".note-form__title").value;
    const date = document.querySelector(".note-form__date-input").value;
    const timestamp = new Date(date).getTime();

    if (content && date) {
        db.addReminder(content, timestamp);
    }
}

export function updateReminder(noteId) {
    const content = document.querySelector(".note-form__title").value;
    const date = document.querySelector(".note-form__date-input").value;
    const timestamp = new Date(date).getTime();

    if (content && date) {
        db.updateReminder(noteId, content, timestamp);
    }
}

export function populateReminderForm(id) {
    const noteFooter = document.querySelector(".note-form__footer");
    if (!noteFooter.classList.contains("note-form__footer_hidden")) {
        noteFooter.classList.add("note-form__footer_hidden");
    }
    insertNoteFormBody("reminder");
    db.getReminderByKey(id).then(reminder => {
        const noteFormTitle = document.querySelector(".note-form__title");
        noteFormTitle.value = reminder.content;
        const noteFormDate = document.querySelector(".note-form__date-input");
        const date = new Date(reminder.eventTimestamp);
        noteFormDate.value = date.toISOString().substring(0, 16);
    });
}

export function updateNote(editedNoteId, noteType) {
    const noteTitle = document.querySelector(".note-form__title").value;
    const noteTag = document.querySelector(".note-form__tag-input").value;
    const notePinned = document.querySelector(".note-form__pin-checkbox").checked;
    const timestamp = Date.now();
    const fileInput = document.querySelector(".note-form__file-input");
    let image = null;
    if (fileInput.files.length > 0) {
        image = document.querySelector(".note-form__file-input").files[0];
    }

    if (noteType === "note") {
        const content = document.querySelector(".note-form__body-input").value;
        if (content.length > 0 || noteTitle.length > 0) {
            db.updateNote(editedNoteId, noteTitle, noteType, timestamp, notePinned, noteTag, content, null, image)
        } else {
            db.removeNote(editedNoteId);
        }
    } else if (noteType === "list") {
        const noteFormList = document.querySelector(".note-form-list");
        const listItems = [];
        for (const listItem of noteFormList.children) {
            const listItemText = listItem.querySelector(".note-list__text").value;
            const listItemChecked = listItem.querySelector(".note-list__checkbox").checked;
            listItems.push({
                body: listItemText, checked: listItemChecked
            });
        }
        if (Object.keys(listItems).length > 0 || noteTitle.length > 0) {
            db.updateNote(editedNoteId, noteTitle, noteType, timestamp, notePinned, noteTag, null, listItems, image);
        } else {
            db.removeNote(editedNoteId);
        }
    }
}

export function addNoteToDb() {
    const title = document.querySelector(".note-form__title").value;
    const timestamp = Date.now();
    const tag = document.querySelector(".note-form__tag-input").value;
    const pinned = document.querySelector(".note-form__pin-checkbox").checked;
    const noteType = document.querySelector(".note-form__body")
        .contains(document.querySelector(".note-list")) ? "list" : "note";
    let content = "";
    const fileInput = document.querySelector(".note-form__file-input");
    let image = null;
    if (fileInput.files.length > 0) {
        image = document.querySelector(".note-form__file-input").files[0];
    }
    if (noteType === "note") {
        content = document.querySelector(".note-form__body-input").value;
        if (title || content) {
            db.addNote(title, tag, timestamp, noteType, pinned, content, null, image);
        }
    } else if (noteType === "list") {
        let listItems = [];
        const list = document.querySelector(".note-form__body .note-list");
        list.childNodes.forEach(function (listItem) {
            const checkboxValue = listItem.querySelector(".note-list__checkbox").checked;
            const text = listItem.querySelector(".note-list__text").value;

            if (text) {
                listItems.push({
                    body: text, checked: checkboxValue
                });
            }
        });
        if (title || listItems.length) {
            db.addNote(title, tag, timestamp, noteType, pinned, null, listItems, image);
        }
    }
}

export function populateNoteForm(key) {
    db.getNoteByKey(key).then(note => {
        const noteFormTitle = document.querySelector(".note-form__title");
        noteFormTitle.value = note.title;
        const noteFormPinCheckbox = document.querySelector(".note-form__pin-checkbox");
        noteFormPinCheckbox.checked = note.pinned;

        if (note.type === "note") {
            insertNoteFormBody(note.type)
            const noteFormText = document.querySelector(".note-form__body-input");
            noteFormText.value = note.content;
        } else if (note.type === "list") {
            const noteFormList = document.createElement("ul");
            noteFormList.classList.add("note-list", "note-form-list");
            for (const key in note.listItems) {
                const listItemElement = createFormListItem(note.listItems[key].checked, note.listItems[key].body, key);
                noteFormList.appendChild(listItemElement);
                addNoteFormListItemListeners(listItemElement);
            }
            document.querySelector(".note-form__body").appendChild(noteFormList);
        }
        const noteFormTag = document.querySelector(".note-form__tag-input");
        noteFormTag.value = note.tag;

        const noteFormFooter = document.querySelector(".note-form__footer");
        if (noteFormFooter.classList.contains("note-form__footer_hidden")) {
            noteFormFooter.classList.remove("note-form__footer_hidden");
        }
    });
}