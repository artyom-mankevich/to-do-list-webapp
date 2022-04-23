import {db} from "../db/db.js";
import {setEventListeners, addListCheckboxListeners} from "./eventListeners.js";

export function drawNotes() {
    db.getNotes().then(notes => {
        notes = notes.reverse();
        const notesContainer = document.querySelector(".notes");
        notes.forEach(note => {
            const noteElement = createNoteElement(note);
            noteElement.id = note.key;
            notesContainer.appendChild(noteElement);
        });
        setEventListeners();
    });
}

export function removeNoteElement(noteKey) {
    const noteElement = document.getElementById(noteKey);
    noteElement.remove();
}

export function addNoteElement(noteKey, noteVal) {
    const noteElement = createNoteElement(noteVal);
    noteElement.id = noteKey;
    const notesContainer = document.querySelector(".notes");
    if (noteVal.pinned) {
        notesContainer.insertBefore(noteElement, notesContainer.firstChild);
    } else {
        notesContainer.appendChild(noteElement);
    }
    if (noteVal.type === "list") {
        addListCheckboxListeners(noteElement);
    }
}

export function changeNoteElement(noteKey, noteVal) {
    const noteElement = document.querySelector(`#${noteKey}`);
    const noteHeader = noteElement.querySelector(".note__header");
    const noteTitle = noteHeader.querySelector(".note__title");
    noteTitle.innerHTML = noteVal.title;

    const notePinned = noteHeader.querySelector(".note__pin-icon");
    if (noteVal.pinned) {
        if (!notePinned.classList.contains("note__pin-icon_active")) {
            notePinned.classList.add("note__pin-icon_active");
        }
    } else {
        notePinned.classList.remove("note__pin-icon_active");
    }
    let noteBody;
    if (noteVal.type === 'note') {
        noteBody = noteElement.querySelector(".note__text");
        noteBody.innerHTML = noteVal.content;
    } else if (noteVal.type === 'list') {
        noteBody = noteElement.querySelector(".note-list");
        for (const key in noteVal.listItems) {
            const listItemElement = noteBody.querySelector(`#${key}`);
            if (listItemElement) {
                const checkbox = listItemElement.querySelector("input");
                checkbox.checked = noteVal.listItems[key].checked;
                const listItemText = listItemElement.querySelector("label");
                listItemText.innerHTML = noteVal.listItems[key].body;
            }
        }
    }
}

function createNoteElement(note_val) {
    const noteElement = document.createElement("article");
    noteElement.classList.add("note");
    const noteHeader = document.createElement("section");
    noteHeader.classList.add("note__header");
    if (note_val.pinned) {
        noteHeader.innerHTML = `
                        <img class="note__pin-icon note__pin-icon_active"
                             src="../static/img/pin.svg" alt="Pin icon">
                        <h2 class="note__title">${note_val.title}</h2>`;
    } else {
        noteHeader.innerHTML =
            `<img class="note__pin-icon"
                             src="../static/img/pin.svg" alt="Pin icon">
             <h2 class="note__title">${note_val.title}</h2>`;
    }
    noteElement.appendChild(noteHeader);

    let noteBody;
    if (note_val.type === "note") {
        noteBody = document.createElement("p");
        noteBody.classList.add("note__text");
        noteBody.innerHTML = note_val.content;
    } else if (note_val.type === "list") {
        noteBody = getListBody(note_val);
    }
    noteElement.appendChild(noteBody);
    return noteElement;
}

function getListBody(note) {
    const noteBody = document.createElement("ul");
    noteBody.classList.add("note-list");

    const max_list_items = 5;

    let index = 0;
    for (const key in note.listItems) {
        if (index >= max_list_items) {
            break;
        }
        const listItemElement = document.createElement("li");
        listItemElement.id = key;
        listItemElement.classList.add("note-list__item");

        const listItemCheckbox = document.createElement("input");
        listItemCheckbox.type = "checkbox";
        listItemCheckbox.classList.add("note-list__checkbox");
        listItemCheckbox.checked = note.listItems[key].checked;

        const listItemText = document.createElement("label");
        listItemText.classList.add("note-list__text");
        listItemText.innerHTML = note.listItems[key].body;

        listItemElement.appendChild(listItemCheckbox);
        listItemElement.appendChild(listItemText);
        noteBody.appendChild(listItemElement);
        index++;
    }
    return noteBody;
}
