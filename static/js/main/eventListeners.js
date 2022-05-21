import {
    drawFormImageElement,
    cleanFormImages,
    cleanNotifications,
    clearForm,
    createFormListItem,
    deactivateTags,
    drawNotes,
    drawNotesByTag,
    drawNotifications,
    getNoteFormType,
    getNoteType,
    insertNoteFormBody,
    removeAllNoteElements,
    removeNoteFormBody,
    toggleCategoriesButton,
    toggleControllable,
    toggleDarkBackground, toggleMobileCategoriesButton, deactivateMobileTags
} from "./domManipulation.js";
import {db} from "../db/db.js";
import {
    addNoteToDb,
    addReminderToDb,
    populateNoteForm,
    populateReminderForm,
    updateNote,
    updateReminder
} from "./DOMToDb.js";
import {auth} from "../auth/auth.js";

let editing = false;
let editedNoteId = 0;

export function setEventListeners() {
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".menu-button");
    menuButton.addEventListener("click", function () {
        toggleControllable(menu, "menu_hidden");
    });

    addCategoriesListeners();
    addMobileCategoriesListeners();
    addNotificationsListeners();
    addNoteFormListeners();
    addNoteFormListButtonListeners();
    addFileInputListener();
    addLogoutListener();

    const pinCheckbox = document.querySelector(".note-form__pin-checkbox");
    pinCheckbox.checked = false;
}

function addLogoutListener() {
    const logoutButton = document.querySelector(".header-auth__item");
    logoutButton.addEventListener("click", function () {
        auth.signOut();
        console.log(sessionStorage.getItem("userId"));
        window.location.replace('../templates/login.html');
    });
}

export function addNoteFormListItemListeners(listItem) {
    const listItemTextInput = listItem.lastElementChild;
    listItemTextInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const newItem = createFormListItem();
            addNoteFormListItemListeners(newItem);
            listItem.parentElement.insertBefore(newItem, listItem.nextSibling);
            const newItemTextInput = newItem.lastElementChild;
            newItemTextInput.focus();
        }
        if (event.key === "Backspace" && listItemTextInput.value === "") {
            listItem.remove();
            if (listItem.previousSibling) {
                const prevItemTextInput = listItem.previousSibling.lastElementChild;
                prevItemTextInput.focus();
            }
        }
    });
}

function addNoteFormListButtonListeners() {
    const listButton = document.querySelector(".note-form__list-button");
    listButton.addEventListener("click", function () {
        const noteType = getNoteFormType() === "list" ? "note" : "list";
        removeNoteFormBody();
        insertNoteFormBody(noteType);
    });
}

export function addNotePinListeners() {
    const pinButtons = document.querySelectorAll(".note__pin-icon");
    pinButtons.forEach(function (pinButton) {
        pinButton.addEventListener("click", function () {
            toggleControllable(pinButton, "note__pin-icon_active");
            const noteId = pinButton.parentElement.parentElement.id;
            db.updateNotePinned(noteId, pinButton.classList.contains("note__pin-icon_active"));
        });
    });
}

function addOutsideFormClickListener(noteForm, noteAddButton) {
    document.addEventListener("click", function (e) {
        const noteAddFormHidden = noteForm.classList.contains("note-form_hidden");
        const notes = Array.from(document.querySelectorAll(".note"));
        if (!noteAddFormHidden && !noteForm.contains(e.target) && !noteAddButton.contains(e.target) && !notes.some(note => note.contains(e.target))) {
            toggleControllable(noteForm, "note-form_hidden");
            toggleDarkBackground();
            const noteFormType = getNoteFormType();
            if (noteFormType === "list" || noteFormType === "note") {
                if (!editing) {
                    addNoteToDb();
                } else {
                    updateNote(editedNoteId, noteFormType);
                }
            } else {
                if (!editing) {
                    addReminderToDb();
                } else {
                    updateReminder(editedNoteId);
                }
            }
            clearForm();
            cleanFormImages();
        }
    })
}

function addNoteFormListeners() {
    const noteAddButton = document.querySelector(".main-panel__add-button");
    const noteForm = document.querySelector(".note-form");
    const pinButton = document.querySelector(".note-form__pin-checkbox");
    const noteFooter = document.querySelector(".note-form__footer");
    const noteType = getNoteType();

    noteAddButton.addEventListener("click", function () {
        editing = false;
        insertNoteFormBody(getNoteType());
        if (noteType === "reminder") {
            if (!noteFooter.classList.contains("note-form__footer_hidden")) {
                noteFooter.classList.add("note-form__footer_hidden");
            }
        } else {
            if (noteFooter.classList.contains("note-form__footer_hidden")) {
                noteFooter.classList.remove("note-form__footer_hidden");
            }
        }
        toggleControllable(noteForm, "note-form_hidden");
        toggleDarkBackground();
    })
    addOutsideFormClickListener(noteForm, noteAddButton);
    addFileButtonListener();

    pinButton.addEventListener("click", function () {
        toggleControllable(pinButton, "note-form__pin-icon_opaque");
    });
}

function addFileButtonListener() {
    const fileButton = document.querySelector(".note-form__picture-button");
    const fileInput = document.querySelector(".note-form__file-input");

    fileButton.addEventListener("click", function () {
        fileInput.click();
    });
}

function addFileInputListener() {
    const fileInput = document.querySelector(".note-form__file-input");
    const imagesContainer = document.querySelector(".form-images-container");
    fileInput.addEventListener("change", function (event) {
        if (imagesContainer.children.length < 1) {
            const files = event.target.files;
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.size < 512000) {
                        drawFormImageElement(file);
                    } else alert("File is too big, max size is 500kb");
                }
            }
        } else alert("You can upload only one image");
    });
}

export function addReminderEditListeners() {
    const reminders = document.querySelectorAll(".reminder");
    const noteForm = document.querySelector(".note-form");
    reminders.forEach(reminder => {
        reminder.addEventListener("click", function (event) {
            if (!event.target.classList.contains("note__remove-button")) {
                editedNoteId = reminder.id;
                editing = true;
                toggleControllable(noteForm, "note-form_hidden");
                populateReminderForm(reminder.id);
                toggleDarkBackground();
            }
        });
    });
}

export function addRemoveNoteButtonListeners() {
    const buttons = document.querySelectorAll(".note__remove-button");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const noteType = getNoteType();
            if (noteType === "note" || noteType === "list") {
                db.removeNote(button.parentNode.id);
            } else if (noteType === "reminder") {
                db.removeReminder(button.parentNode.id);
            }
        });
    });
}

export function addNoteEditListeners() {
    const notes = document.querySelectorAll(".note");
    const noteForm = document.querySelector(".note-form");
    notes.forEach(function (note) {
        note.addEventListener("click", function (event) {
            if (!event.target.classList.contains("note__pin-icon") && !event.target.classList.contains("note__remove-button")) {
                editedNoteId = note.id;
                editing = true;
                toggleControllable(noteForm, "note-form_hidden");
                populateNoteForm(note.id);
                toggleDarkBackground();
            }
        });
    });
}

function addNotificationsListeners() {
    const notificationsButton = document.querySelector(".header__notification-button");
    const notifications = document.querySelector(".notifications");
    notificationsButton.addEventListener("click", function () {
        cleanNotifications();
        toggleControllable(notifications, "notifications_hidden");
        toggleDarkBackground();
        drawNotifications();
    });
    document.addEventListener("click", function (e) {
        const notificationsHidden = notifications.classList.contains("notifications_hidden");
        if (!notificationsHidden && !notifications.contains(e.target) && !notificationsButton.contains(e.target)) {
            toggleControllable(notifications, "notifications_hidden");
            toggleDarkBackground();
        }
    })
}

export function addTagsListeners(tagsButtons = null) {
    if (tagsButtons === null) {
        tagsButtons = document.querySelectorAll(".tags-buttons__item");
    }
    tagsButtons.forEach(function (item, index) {
        item.addEventListener("click", function (event) {
            if (event.target.classList.contains("tags-buttons__remove-item-button")) {
                item.remove();
                db.removeTag(item.textContent.slice(0, -1));
            } else {
                deactivateTags(event.target);
                toggleControllable(item, "tags-buttons__item_active");
                toggleControllable(item.firstElementChild, "tags-buttons__icon_active");

                removeAllNoteElements();
                if (item.classList.contains("tags-buttons__item_active")) {
                    drawNotesByTag(item.textContent.slice(0, -1));
                } else {
                    drawNotes();
                }
            }
        });
    });
}

export function addMobileTagsListeners(tagsButtons = null) {
    if (tagsButtons === null) {
        tagsButtons = document.querySelectorAll(".tags-list__item");
    }
    tagsButtons.forEach(tagButton => {
        tagButton.addEventListener("click", function (event) {
            deactivateMobileTags(event.target);
            toggleControllable(tagButton, "tags-list__item_active");

            removeAllNoteElements();
            if (tagButton.classList.contains("tags-list__item_active")) {
                drawNotesByTag(tagButton.textContent);
            } else {
                drawNotes();
            }
        });
    });
}

function addCategoriesListeners() {
    const categoriesButtons = document.querySelectorAll(".side-menu-categories__item");
    categoriesButtons.forEach(function (item) {
        item.addEventListener("click", function () {
            toggleCategoriesButton(item, categoriesButtons);
        });
    });
}

function addMobileCategoriesListeners() {
    const categoriesButtons = document.querySelectorAll(".categories-list__item");
    categoriesButtons.forEach(function (item) {
        item.addEventListener("click", function () {
            toggleMobileCategoriesButton(item, categoriesButtons);
        });
    });
}
