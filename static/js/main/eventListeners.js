import {addNoteToDb} from "./dbRequests.js";
import {db} from "../db/db.js";

export var noteType = "note";

export function setEventListeners() {
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".menu-button");
    const categoriesMenu = document.querySelector(".categories-menu");
    const tagsMenu = document.querySelector(".tags-menu");
    menuButton.addEventListener("click", function () {
        toggleControllable(menu, "menu_hidden");
        toggleControllable(categoriesMenu, "categories-menu_hidden");
        toggleControllable(tagsMenu, "tags-menu_hidden");
    });

    addCategoriesListeners();
    addTagsListeners();
    addNotificationsListeners();
    addNoteFormListeners();
    // addNoteEditListeners();
    addNotePinListeners();
    addListCheckboxListeners();

    const pinCheckbox = document.querySelector(".note-form__pin-checkbox");
    pinCheckbox.checked = false;
}

export function addListCheckboxListeners(note = null) {
    let checkboxes;
    if (note === null) {
        checkboxes = document.querySelectorAll(".note-list__checkbox");
    } else {
        checkboxes = note.querySelectorAll(".note-list__checkbox");
    }
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function (event) {
            const noteId = checkbox.parentElement.parentElement.parentElement.id;
            db.updateNoteListItem(noteId,
                checkbox.checked,
                checkbox.parentElement.id);
        });
    });
}

function addNotePinListeners() {
    const pinButtons = document.querySelectorAll(".note__pin-icon");
    pinButtons.forEach(function (pinButton) {
        pinButton.addEventListener("click", function () {
            toggleControllable(pinButton, "note__pin-icon_active");
            const noteId = pinButton.parentElement.parentElement.id;
            db.updateNotePinned(noteId, pinButton.classList.contains("note__pin-icon_active"));
        });
    });
}

function addNoteFormListeners() {
    const noteAddButton = document.querySelector(".main-panel__add-button");
    const noteForm = document.querySelector(".note-form");
    const pinButton = document.querySelector(".note-form__pin-checkbox");

    noteAddButton.addEventListener("click", function () {
        toggleControllable(noteForm, "note-form_hidden");
        toggleDarkBackground();
    })
    document.addEventListener("click", function (e) {
        const noteAddFormHidden = noteForm.classList.contains("note-form_hidden");
        if (!noteAddFormHidden
            && !noteForm.contains(e.target)
            && !noteAddButton.contains(e.target)
        ) {
            toggleControllable(noteForm, "note-form_hidden");
            toggleDarkBackground();
            addNoteToDb();
        }
    })

    pinButton.addEventListener("click", function () {
        toggleControllable(pinButton, "note-form__pin-icon_opaque");
    });
}

function addNotificationsListeners() {
    const notificationsButton = document.querySelector(".header__notification-button");
    const notifications = document.querySelector(".notifications");
    notificationsButton.addEventListener("click", function () {
        toggleControllable(notifications, "notifications_hidden");
        toggleDarkBackground()
    });
    document.addEventListener("click", function (e) {
        const notificationsHidden = notifications.classList.contains("notifications_hidden");
        if (!notificationsHidden
            && !notifications.contains(e.target)
            && !notificationsButton.contains(e.target)
        ) {
            toggleControllable(notifications, "notifications_hidden");
            toggleDarkBackground();
        }
    })
}

function addTagsListeners() {
    const tagsButtons = document.querySelectorAll(".tags-buttons__item");
    tagsButtons.forEach(function (item, index) {
        item.addEventListener("click", function (event) {
            toggleControllable(item, "tags-buttons__item_active");
            toggleControllable(item.childNodes[1], "tags-buttons__icon_active");
        });
    });
}

function addCategoriesListeners() {
    const categoriesButtons = document.querySelectorAll(".side-menu-categories__item");
    categoriesButtons.forEach(function (item, index) {
        item.addEventListener("click", function (event) {
            toggleCategoriesButton(item, categoriesButtons);
        });
    });
}

function toggleCategoriesButton(button, buttonsList) {
    const buttonIcon = button.childNodes[1];
    buttonsList.forEach(function (item, index) {
        if (item.classList.contains("side-menu-categories__item_active")) {
            item.classList.remove("side-menu-categories__item_active");
            item.childNodes[1].classList.remove("side-menu-categories__icon_active");
        }
    });
    toggleControllable(button, "side-menu-categories__item_active");
    toggleControllable(buttonIcon, "side-menu-categories__icon_active");
}

function toggleDarkBackground() {
    const mainPanel = document.querySelector(".main-panel");
    const sideMenu = document.querySelector(".side-menu");
    toggleControllable(mainPanel, "main-panel_darkened");
    toggleControllable(sideMenu, "side-menu_darkened");
}

function toggleControllable(controllable, className) {
    if (controllable.classList.contains(className)) {
        controllable.classList.remove(className);
    } else {
        controllable.classList.add(className);
    }
}
