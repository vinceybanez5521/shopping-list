const form = document.querySelector("form");
const input = document.querySelector("#input");
const searchInput = document.querySelector("#search");
const errorText = document.querySelector(".error-text");
const ul = document.querySelector("ul");
const button = document.querySelector("form button");
const clearBtn = document.querySelector("#clear-all");
let isEditMode = false;

const onSubmit = (e) => {
    e.preventDefault();

    if (!input.value) {
        input.classList.add("error");
        errorText.textContent = "Invalid Input";
        errorText.classList.remove("hidden");
        return;
    }

    input.classList.remove("error");
    errorText.classList.add("hidden");

    if (isEditMode) {
        const editMode = document.querySelector(".edit-mode");
        removeFromLocalStorage(editMode.textContent);
        editMode.remove();

        button.innerHTML = "";
        const plusIcon = document.createElement("i");
        plusIcon.className = "fas fa-plus";

        button.appendChild(plusIcon);
        button.appendChild(document.createTextNode("Add Item"));
        button.style.backgroundColor = "tomato";

        isEditMode = false;
    }

    // Save to localStorage
    saveToLocalStorage(input.value);
}

const createListItem = (value) => {
    const li = document.createElement("li");
    li.textContent = value;

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash";

    li.appendChild(deleteIcon);
    ul.appendChild(li);
}

const saveToLocalStorage = (value) => {
    const itemsFromLocalStorage = getItemsFromLocalStorage();

    if (isItemExists(value)) {
        errorText.classList.remove("hidden");
        errorText.textContent = "Item already exists";
        return;
    }

    errorText.classList.add("hidden");

    itemsFromLocalStorage.push(value);
    localStorage.setItem("items", JSON.stringify(itemsFromLocalStorage));

    createListItem(value);
    input.value = "";
    checkUI();
}

const isItemExists = (value) => {
    const itemsFromLocalStorage = getItemsFromLocalStorage();
    return itemsFromLocalStorage.includes(value);
}

const getItemsFromLocalStorage = () => {
    let itemsFromLocalStorage;

    if (localStorage.getItem("items")) {
        itemsFromLocalStorage = JSON.parse(localStorage.getItem("items"));
    } else {
        itemsFromLocalStorage = [];
    }

    return itemsFromLocalStorage;
}

const displayItems = () => {
    const itemsFromLocalStorage = getItemsFromLocalStorage();

    itemsFromLocalStorage.forEach(item => {
        createListItem(item);
    });

    checkUI();
}

const onClickList = (e) => {
    if (e.target.tagName === "I") {
        if (confirm("Are you sure you want to delete this item?")) {
            removeItem(e.target);
        }
    } else {
        setEditItem(e);
    }
}

const removeItem = (item) => {
    removeFromLocalStorage(item.parentElement.textContent);
    item.parentElement.remove();
    checkUI();
}

const removeFromLocalStorage = (itemToRemove) => {
    let itemsFromLocalStorage = getItemsFromLocalStorage();
    itemsFromLocalStorage = itemsFromLocalStorage.filter(item => item !== itemToRemove);
    localStorage.setItem("items", JSON.stringify(itemsFromLocalStorage));
}

const setEditItem = (e) => {
    document.querySelectorAll("li").forEach(li => {
        li.classList.remove("edit-mode");
    });

    e.target.classList.add("edit-mode");

    input.value = e.target.textContent;
    button.innerHTML = "";

    const updateIcon = document.createElement("i");
    updateIcon.className = "fas fa-pen";

    button.appendChild(updateIcon);
    button.appendChild(document.createTextNode("Update Item"));
    button.style.backgroundColor = "green";

    isEditMode = true;
}

const clearAll = () => {
    if (confirm("Are you sure you want to delete all items?")) {
        localStorage.removeItem("items");
        while (ul.firstElementChild) {
            ul.removeChild(ul.firstElementChild);
        }

        checkUI();
    }
}

const filterItems = (e) => {
    const searchText = e.target.value;

    let listItems = document.querySelectorAll("li");
    listItems.forEach(item => {
        if (item.textContent.indexOf(searchText) !== -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

const checkUI = () => {
    if (document.querySelectorAll("li").length > 0) {
        searchInput.style.display = "block";
        clearBtn.style.display = "inline-block";
    } else {
        searchInput.style.display = "none";
        clearBtn.style.display = "none";
    }
}

form.addEventListener("submit", onSubmit);
document.addEventListener("DOMContentLoaded", displayItems);
ul.addEventListener("click", onClickList);
clearBtn.addEventListener("click", clearAll);
searchInput.addEventListener("input", filterItems);

checkUI();