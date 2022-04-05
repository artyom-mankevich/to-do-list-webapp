import {setEventListeners} from "./eventListeners.js";
import {db} from "../db/config.js";

setEventListeners();
drawNotes();

function drawNotes() {
    db.getNotes().then(notes => {

    });
    const notesContainer = document.querySelector(".notes");
    notes.forEach(note => {
        const noteElement = document.createElement("article");
        noteElement.classList.add("note");
        noteElement.innerHTML = `
                <section class="note__header">
                    $if(note.pinned) {
                        <img class="note__pin-icon note__pin-icon_active"
                         src="../static/img/pin.svg" alt="Pin icon">
                    }
                    <h2 class="note__title">
                        ${note.title};
                    </h2>
                </section>
                <p class="note__text">${note.content};</p>
            `;
        notesContainer.appendChild(noteElement);
    });
}
