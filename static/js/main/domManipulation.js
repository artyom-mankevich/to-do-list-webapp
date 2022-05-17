import {db} from "../db/db.js";
import {
    addMobileTagsListeners,
    addNoteEditListeners,
    addNoteFormListItemListeners,
    addNotePinListeners,
    addReminderEditListeners,
    addRemoveNoteButtonListeners,
    addTagsListeners
} from "./eventListeners.js";

export function insertNoteFormBody(noteType) {
    const noteFormBody = document.querySelector(".note-form__body");
    if (noteType === "note") {
        const contentInput = document.createElement("textarea");
        contentInput.classList.add("note-form__input", "note-form__body-input");
        contentInput.placeholder = "Your note ...";
        contentInput.maxLength = 255;
        noteFormBody.appendChild(contentInput);
    } else if (noteType === "list") {
        const list = document.createElement("ul");
        list.classList.add("note-list", "note-form-list");
        const listItem = createFormListItem();
        list.appendChild(listItem);
        noteFormBody.appendChild(list);
        addNoteFormListItemListeners(listItem);
    } else if (noteType === "reminder") {
        const reminderInput = document.createElement("input");
        reminderInput.classList.add("note-form__date-input");
        reminderInput.type = "datetime-local";
        noteFormBody.appendChild(reminderInput);
    }
}

export function removeNoteFormBody() {
    const noteFormBody = document.querySelector(".note-form__body");
    while (noteFormBody.firstChild) {
        noteFormBody.removeChild(noteFormBody.lastChild);
    }
}

export function createFormListItem(checkboxValue = false, textValue = "", listItemKey = null) {
    const listItem = document.createElement("li");
    listItem.classList.add("note-list__item");
    if (listItemKey) {
        listItem.id = listItemKey;
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("note-list__checkbox");
    checkbox.checked = checkboxValue;

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.classList.add("note-form__input", "note-list__text");
    textInput.placeholder = "new item";
    textInput.value = textValue;
    textInput.maxLength = 50;

    listItem.appendChild(checkbox);
    listItem.appendChild(textInput);

    return listItem;
}

export function drawFormImageElement(imageSource) {
    const imagesContainer = document.querySelector(".form-images-container");
    const image = document.createElement("img");
    image.classList.add("form-images-container__item");
    image.src = URL.createObjectURL(imageSource);
    imagesContainer.appendChild(image);
}

export function clearForm() {
    const noteFormTitle = document.querySelector(".note-form__title");
    noteFormTitle.value = "";
    const noteFormTag = document.querySelector(".note-form__tag-input");
    noteFormTag.value = "";
    const noteFormCheckbox = document.querySelector(".note-form__pin-checkbox");
    noteFormCheckbox.checked = false;
    removeNoteFormBody();
}

export function cleanFormImages() {
    const formImagesContainer = document.querySelector(".form-images-container");
    while (formImagesContainer.firstChild) {
        formImagesContainer.removeChild(formImagesContainer.lastChild);
    }
    const imagesInput = document.querySelector(".note-form__file-input");
    imagesInput.value = null;
}

export function drawNotifications() {
    db.getLastTwoReminders().then(reminders => {
        const notificationsContainer = document.querySelector(".notifications");
        reminders.forEach(reminder => {
            const notification = document.createElement("section");
            notification.classList.add("notification");
            const img = document.createElement("img");
            img.classList.add("notification__icon");
            img.alt = "Calendar icon";

            const notificationText = document.createElement("p");
            notificationText.classList.add("notification__text");

            const dateString = new Date(reminder.eventTimestamp).toLocaleString();
            if (reminder.eventTimestamp < Date.now()) {
                img.src = "../static/img/cross-calendar.svg";
                let reminderContent = reminder.content;
                if (reminder.content.length > 15) {
                    reminderContent = reminder.content.slice(0, 15) + "...";
                }
                notificationText.innerText = `${reminderContent} has happened at ${dateString}`;
            } else {
                img.src = "../static/img/calendar.svg";
                let reminderContent = reminder.content;
                if (reminder.content.length > 15) {
                    reminderContent = reminder.content.slice(0, 15) + "...";
                }
                notificationText.innerText = `${reminderContent} happens at ${dateString}`;
            }
            notification.appendChild(img);
            notification.appendChild(notificationText);
            notificationsContainer.appendChild(notification);
        });
    });
}

export function cleanNotifications() {
    const notificationsContainer = document.querySelector(".notifications");
    while (notificationsContainer.firstChild) {
        notificationsContainer.removeChild(notificationsContainer.lastChild);
    }
}

export function addReminderElement(key, value) {
    if (!document.querySelector(`#${key}`)) {
        const remindersContainer = document.querySelector(".notes");
        remindersContainer.appendChild(createReminderElement(key, value));
        addReminderEditListeners();
        addRemoveNoteButtonListeners();
    }
}

export function removeReminderElement(key) {
    const reminder = document.querySelector(`#${key}`);
    if (reminder) {
        reminder.remove();
    }
}

export function changeReminderElement(key, val) {
    const reminder = document.querySelector(`#${key}`);
    if (reminder) {
        const reminderText = reminder.querySelector(".note__content");
        reminderText.innerText = val.content;
        const reminderDate = reminder.querySelector(".note__title");
        reminderDate.innerText = new Date(val.eventTimestamp).toLocaleString();
    }
}

export function drawReminders() {
    db.getReminders().then(reminders => {
        reminders = reminders.reverse();
        const remindersContainer = document.querySelector(".notes");
        reminders.forEach(reminder => {
            const reminderElement = createReminderElement(reminder.key, {
                content: reminder.content,
                eventTimestamp: reminder.eventTimestamp
            });
            remindersContainer.appendChild(reminderElement);
        });
        addReminderEditListeners();
        addRemoveNoteButtonListeners();
    });
}

function createReminderElement(key, value) {
    const reminderElement = document.createElement("article");
    reminderElement.classList.add("note", "reminder");
    reminderElement.id = key;

    const reminderHeader = document.createElement("section");
    reminderHeader.classList.add("note__header");

    const reminderTitle = document.createElement("h2");
    reminderTitle.classList.add("note__title");
    reminderTitle.innerText = new Date(value.eventTimestamp).toLocaleString();
    reminderHeader.appendChild(reminderTitle);

    const reminderContent = document.createElement("p");
    reminderContent.classList.add("note__content", "note__text");
    reminderContent.innerText = value.content;

    reminderElement.appendChild(reminderHeader);
    reminderElement.appendChild(reminderContent);

    const closeButton = document.createElement("button");
    closeButton.classList.add("note__remove-button", "note__remove-button_hidden");
    closeButton.innerText = "✖";
    reminderElement.appendChild(closeButton);
    return reminderElement;
}

export function drawNotes() {
    db.getNotes().then(notes => {
        notes = notes.reverse();
        addNotesToContainer(notes);
    });
}

function addNotesToContainer(notes) {
    const notesContainer = document.querySelector(".notes");
    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        noteElement.id = note.key;
        notesContainer.appendChild(noteElement);
    });
    addNoteEditListeners();
    addNotePinListeners();
    addRemoveNoteButtonListeners();
}

export function drawNotesByTag(tag) {
    db.getNotesByTag(tag).then(notes => {
        notes.sort((a, b) => {
            return b.pinned - a.pinned;
        });
        addNotesToContainer(notes);
    });
}

export function removeAllNoteElements() {
    const notesContainer = document.querySelector(".notes");
    while (notesContainer.firstChild) {
        notesContainer.removeChild(notesContainer.lastChild);
    }
}

export function removeNoteElementById(noteKey) {
    const noteElement = document.getElementById(noteKey);
    if (noteElement) {
        noteElement.remove();
    }
}

export function drawTagElement(tag) {
    const tagsContainer = document.querySelector(".tags-buttons");
    const mobileTagsContainer = document.querySelector(".tags-list");
    const tagButton = createTagElement(tag);
    const mobileTagButton = createMobileTagElement(tag);
    tagsContainer.appendChild(tagButton);
    mobileTagsContainer.appendChild(mobileTagButton);
    addTagsListeners([tagButton]);
    addMobileTagsListeners([mobileTagButton]);
}

export function createTagElement(tag) {
    const tagButton = document.createElement("button");
    tagButton.classList.add("tags-buttons__item");

    const tagImage = document.createElement("img");
    tagImage.classList.add("tags-buttons__icon");
    tagImage.src = "../static/img/bookmark.png";
    tagImage.alt = "Tag icon";

    const closeButton = document.createElement("button");
    closeButton.classList.add("tags-buttons__remove-item-button");
    closeButton.innerText = "✖";

    tagButton.appendChild(tagImage);
    tagButton.appendChild(document.createTextNode(tag));
    tagButton.appendChild(closeButton);

    return tagButton;
}

export function createMobileTagElement(tag) {
    const mobileTag = document.createElement("li");
    mobileTag.classList.add("tags-list__item");
    mobileTag.innerText = tag;
    return mobileTag;
}

export function drawNoteElement(noteKey, noteVal) {
    if (document.querySelector(`#${noteKey}`)) {
        return;
    }
    const noteElement = createNoteElement(noteVal);
    noteElement.id = noteKey;
    const notesContainer = document.querySelector(".notes");
    if (noteVal.pinned) {
        notesContainer.insertBefore(noteElement, notesContainer.firstChild);
    } else {
        notesContainer.appendChild(noteElement);
    }
    addNoteEditListeners();
    addNotePinListeners();
    addRemoveNoteButtonListeners();
}

export function deactivateTags(eventTarget) {
    const tags = document.querySelectorAll(".tags-buttons__item");
    tags.forEach(function (item) {
        if (item.classList.contains("tags-buttons__item_active") && item !== eventTarget) {
            item.classList.remove("tags-buttons__item_active");
            item.firstElementChild.classList.remove("tags-buttons__icon_active");
        }
    });
}

export function deactivateMobileTags(eventTarget) {
    const tags = document.querySelectorAll(".tags-list__item");
    tags.forEach(function (item) {
        if (item.classList.contains("tags-list__item_active") && item !== eventTarget) {
            item.classList.remove("tags-list__item_active");
        }
    });
}

export function changeNoteElement(noteKey, noteVal) {
    const noteElement = document.querySelector(`#${noteKey}`);
    const noteHeader = noteElement.querySelector(".note__header");
    const noteTitle = noteHeader.querySelector(".note__title");
    noteTitle.innerHTML = noteVal.title.slice(0, 10);

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
        if (noteBody) {
            noteBody.innerHTML = noteVal.content;
        } else {
            const noteList = noteElement.querySelector(".note-list");
            noteBody = document.createElement("p");
            noteBody.classList.add("note__text");
            noteBody.innerHTML = noteVal.content;
            noteElement.replaceChild(noteBody, noteList);
        }
    } else if (noteVal.type === 'list') {
        noteBody = noteElement.querySelector(".note-list");
        if (noteBody) {
            noteBody.innerHTML = "";
        } else {
            const noteText = noteElement.querySelector(".note__text");
            noteBody = document.createElement("ul");
            noteBody.classList.add("note-list");
            noteElement.replaceChild(noteBody, noteText);
        }
        for (const key in noteVal.listItems) {
            const listItemElement = createListItemElement(
                key,
                noteVal
            );
            noteBody.appendChild(listItemElement);
        }
    }
    if (noteVal.image) {
        let noteImage = noteElement.querySelector(".note__image");
        if (noteImage) {
            noteImage.src = noteVal.image;
        } else {
            let noteImage = document.createElement("img");
            noteImage.classList.add("note__image");
            noteImage.src = noteVal.image;
            noteElement.appendChild(noteImage);
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
                        <h2 class="note__title">${note_val.title.slice(0, 10)}</h2>`;
    } else {
        noteHeader.innerHTML =
            `<img class="note__pin-icon"
                             src="../static/img/pin.svg" alt="Pin icon">
             <h2 class="note__title">${note_val.title.slice(0, 10)}</h2>`;
    }
    noteElement.appendChild(noteHeader);

    let noteBody;
    if (note_val.type === "note") {
        noteBody = document.createElement("p");
        noteBody.classList.add("note__text");
        noteBody.innerHTML = note_val.content;
    } else if (note_val.type === "list") {
        noteBody = getNoteListBody(note_val);
    }
    noteElement.appendChild(noteBody);
    if (note_val.image !== undefined && note_val.image !== "") {
        const noteImage = document.createElement("img");
        noteImage.classList.add("note__image");
        noteImage.src = note_val.image;
        noteElement.appendChild(noteImage);
    }
    const closeButton = document.createElement("button");
    closeButton.classList.add("note__remove-button", "note__remove-button_hidden");
    closeButton.innerText = "✖";
    noteElement.appendChild(closeButton);
    return noteElement;
}

function createListItemElement(key, note) {
    const listItemElement = document.createElement("li");
    listItemElement.id = key;
    listItemElement.classList.add("note-list__item");

    const listItemCheckbox = document.createElement("input");
    listItemCheckbox.type = "checkbox";
    listItemCheckbox.classList.add("note-list__checkbox");
    listItemCheckbox.checked = note.listItems[key].checked;
    listItemCheckbox.disabled = true;

    const listItemText = document.createElement("label");
    listItemText.classList.add("note-list__text");
    listItemText.innerHTML = note.listItems[key].body.slice(0, 30);

    listItemElement.appendChild(listItemCheckbox);
    listItemElement.appendChild(listItemText);
    return listItemElement;
}

function getNoteListBody(note) {
    const noteBody = document.createElement("ul");
    noteBody.classList.add("note-list");

    const max_list_items = 5;

    let index = 0;
    for (const key in note.listItems) {
        if (index >= max_list_items) {
            break;
        }
        const listItemElement = createListItemElement(key, note);
        noteBody.appendChild(listItemElement);
        index++;
    }
    return noteBody;
}

export function toggleDarkBackground() {
    const mainPanel = document.querySelector(".main-panel");
    const sideMenu = document.querySelector(".side-menu");
    toggleControllable(mainPanel, "main-panel_darkened");
    toggleControllable(sideMenu, "side-menu_darkened");
}

export function toggleControllable(controllable, className) {
    if (controllable.classList.contains(className)) {
        controllable.classList.remove(className);
    } else {
        controllable.classList.add(className);
    }
}

export function toggleCategoriesButton(button, buttonsList) {
    const buttonIcon = button.childNodes[1];
    buttonsList.forEach(function (item, index) {
        if (item.classList.contains("side-menu-categories__item_active")) {
            item.classList.remove("side-menu-categories__item_active");
            item.childNodes[1].classList.remove("side-menu-categories__icon_active");
        }
    });
    removeAllNoteElements();
    const sideMenuTags = document.querySelector(".side-menu-tags");
    if (button.innerText === "Notes") {
        drawNotes();
        if (sideMenuTags.classList.contains("side-menu-tags_hidden")) {
            sideMenuTags.classList.remove("side-menu-tags_hidden");
        }
    } else if (button.innerText === "Reminders") {
        drawReminders()
        if (!sideMenuTags.classList.contains("side-menu-tags_hidden")) {
            sideMenuTags.classList.add("side-menu-tags_hidden");
        }
    }
    toggleControllable(button, "side-menu-categories__item_active");
    toggleControllable(buttonIcon, "side-menu-categories__icon_active");
}

export function toggleMobileCategoriesButton(item, buttons) {
    buttons.forEach(button => {
        if (button.classList.contains("categories-list__item_active")) {
            button.classList.remove("categories-list__item_active");
        }
    })
    removeAllNoteElements();
    const mobileTags = document.querySelector(".tags-menu");
    if (item.innerText === "Notes") {
        drawNotes();
        if (mobileTags.classList.contains("tags-menu_hidden")) {
            mobileTags.classList.remove("tags-menu_hidden");
        }
    } else if (item.innerText === "Reminders") {
        drawReminders()
        if (!mobileTags.classList.contains("tags-menu_hidden")) {
            mobileTags.classList.add("tags-menu_hidden");
        }
    }
    toggleControllable(item, "categories-list__item_active");
    const menu = document.querySelector(".menu");
    toggleControllable(menu, "menu_hidden");
}

export function getNoteType() {
    const categoriesButtons = document.querySelectorAll(".side-menu-categories__item");
    let noteType = "note";
    categoriesButtons.forEach(function (item) {
        if (item.classList.contains("side-menu-categories__item_active")) {
            if (item.innerText === "Notes") {
                noteType = "note";
            } else if (item.innerText === "Reminders") {
                noteType = "reminder";
            }
        }
    });
    return noteType;
}

export function getNoteFormType() {
    const noteFormBody = document.querySelector(".note-form__body");
    if (noteFormBody.querySelector(".note-form-list")) {
        return "list";
    } else if (noteFormBody.querySelector(".note-form__body-input")) {
        return "note";
    } else if (noteFormBody.querySelector(".note-form__date-input")) {
        return "reminder";
    }
}