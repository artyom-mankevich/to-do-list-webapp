import {db} from "../db/db.js";
import {noteType} from "./eventListeners.js";

export function addNoteToDb() {
    const title = document.querySelector(".note-form__title").value;
    const content = document.querySelector(".note-form__body-input").value;
    const timestamp = Date.now();
    const tag = document.querySelector(".note-form__tag-input").value;
    let pinned = false;
    if (document.querySelector(".note-form__pin-checkbox").checked) {
        pinned = true;
    }
    if (title || content) {
        db.addNote(title, content, timestamp, noteType, tag, pinned);
    }
}
