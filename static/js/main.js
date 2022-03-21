setEventListeners()

function setEventListeners() {
    const menu = document.querySelector(".menu")
    const menuButton = document.querySelector(".menu-button")
    const categoriesMenu = document.querySelector(".categories-menu")
    const tagsMenu = document.querySelector(".tags-menu")
    menuButton.addEventListener("click", function () {
        toggleControllable(menu, "menu_hidden")
        toggleControllable(categoriesMenu, "categories-menu_hidden")
        toggleControllable(tagsMenu, "tags-menu_hidden")
    })
}

function toggleControllable(controllable, className) {
    if (controllable.classList.contains(className)) {
        controllable.classList.remove(className)
    } else {
        controllable.classList.add(className)
    }
}
