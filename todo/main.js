const newTaskMessage = document.querySelector(".text-todo");
const addingButton = document.getElementById("addTask");
const selectAll = document.querySelector(".select-all");
const searchInput = document.querySelector("#search");
const currentTasks = document.querySelector(".todo");
const toDoViewing = document.querySelector("#viewing");
const completedTasks = document.querySelector("#done");
const fullTasksList = document.querySelector("#all");
const clear = document.querySelector(".clear-all");
const adding = document.querySelector("#adding");

let toDoList = [];

function byField(field) {
  return (a, b) => (a[field] > b[field] ? 1 : -1);
}

if (localStorage.getItem("todo")) {
  toDoList = JSON.parse(localStorage.getItem("todo"));
  displayMessages();
}

function resetButtonsActivity() {
  const allButtons = Array.from(document.querySelector(".butts").children);
  allButtons.forEach((item) => {
    item.classList.remove("active");
  });
}

selectAll.addEventListener("click", function () {
  toDoList.forEach((item) => {
    item.checked = true;
  });
  displayMessages();
  localStorage.setItem("todo", JSON.stringify(toDoList));
});

toDoViewing.addEventListener("click", function () {
  const items = Array.from(document.querySelectorAll(".item"));
  resetButtonsActivity();
  this.classList.add("active");
  items.forEach((item) => {
    if (!item.classList.contains("doneItem")) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
});

completedTasks.addEventListener("click", function () {
  const items = Array.from(document.querySelectorAll(".item"));
  resetButtonsActivity();
  this.classList.add("active");
  items.forEach((item) => {
    if (item.classList.contains("doneItem")) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
});

fullTasksList.addEventListener("click", function () {
  resetButtonsActivity();
  this.classList.add("active");
  displayMessages();
});

searchInput.addEventListener("input", function (event) {
  const serchStr = this.value;
  let searchList = [];
  const items = Array.from(document.querySelectorAll(".item"));
  items.forEach((item, i) => {
    let label = toDoList[i].toDo;
    if (label.includes(serchStr)) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
});

adding.addEventListener("change", function (event) {
  let newToDo = {
    id: Math.random() * Date.now(),
    toDo: newTaskMessage.value,
    checked: false,
    important: false,
  };
  toDoList.push(newToDo);
  adding.value = "";
  displayMessages();
  localStorage.setItem("todo", JSON.stringify(toDoList));
});

adding.addEventListener("focus", function (event) {
  addingButton.classList.remove("hidden");
});

adding.addEventListener("blur", function (event) {
  addingButton.classList.add("hidden");
});

function addClick() {
  addingButton.classList.add("hidden");
  let displayMessage = "";
  toDoList.forEach(function (item, i) {
    displayMessage += `
            <li class="item ${
              item.checked ? "doneItem" : ""
            }" draggable = "true" id = "${item.id}">
            <img class="button-drag-image" src="img/DragVertical.svg">
                <input class="todoli" type='checkbox' data-id="${
                  item.id
                }" id='item_${i}'  ${item.checked ? "checked" : ""}>
              
                <label  class="label-text" id = "${
                  item.id
                }" for='item_${i}' text = "${item.toDo}">
                <input id="editing" class="text-list ${
                  item.checked ? "striked" : ""
                }" type="text-list" text = "${item.toDo}"  placeholder="${
      item.toDo
    }" readonly >
                      </label>

    <button class="button-trash" id ="${item.id}" >
      <img class="button-trash-image" src="img/Trash.svg">
      </button>
    <button class="button-editing"  id = "${item.id}">
      <img class="button-editing-image" src="${
        item.checked ? "" : "img/Pencil.svg"
      }">
    </button>
            </li>
        `;
  });
  currentTasks.innerHTML = displayMessage;
  let trash = Array.from(document.querySelectorAll(`.button-trash`));
  trash.forEach((item, i) => {
    item.addEventListener("click", function (event) {
      if (item.id == toDoList[i].id) {
        toDoList.splice(i, 1);
        localStorage.setItem("todo", JSON.stringify(toDoList));
      }
      displayMessages();
    });
  });

  const labelText = Array.from(document.querySelectorAll(`.text-list`));
  const editing = Array.from(document.querySelectorAll(`.button-editing`));
  const inputText = Array.from(document.querySelectorAll(`#editing`));
  const editingImage = Array.from(
    document.querySelectorAll(`.button-editing-image`)
  );

  editing.forEach((item, i) => {
    item.addEventListener("click", function (event) {
      labelText[i].removeAttribute("readonly");
      editingImage[i].src = "./img/Done.svg";
    });
  });
  inputText.forEach((item, i) => {
    item.addEventListener("change", function (event) {
      toDoList[i].toDo = this.value;
      localStorage.setItem("todo", JSON.stringify(toDoList));
      displayMessages();
    });
  });

  let elem = Array.from(document.querySelectorAll(`.todoli`));
  elem.forEach((item) => {
    item.addEventListener("change", function (event) {
      changeStatus(event);
      displayMessages();
    });
  });
  dragAndDropItems();
}
function displayMessages() {
  addClick();
}

function changeStatus(event) {
  let idInput = event.target.dataset.id;

  for (let i = 0; i < toDoList.length; i++) {
    if (toDoList[i].id == idInput) {
      toDoList[i].checked = !toDoList[i].checked;
      toDoList.sort(byField("checked"));
      localStorage.setItem("todo", JSON.stringify(toDoList));
      break;
    }
  }
}
function handleDragStart(e) {
  this.style.opacity = "0.4";
}

function handleDragEnd(e) {
  this.style.opacity = "1";
}

let items = document.querySelectorAll(".wrapper .item");
items.forEach(function (item) {
  item.addEventListener("dragstart", handleDragStart);
  item.addEventListener("dragend", handleDragEnd);
});

function handleDragEnd(e) {
  this.style.opacity = "1";

  items.forEach(function (item) {
    item.classList.remove("over");
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  return false;
}

function handleDragEnter(e) {
  this.classList.add("over");
}

function handleDragLeave(e) {
  this.classList.remove("over");
}

function handleDragStart(e) {
  this.style.opacity = "0.4";

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDrop(e) {
  e.stopPropagation();
  if (dragSrcEl !== this) {
    const id1 = this.id;
    const id2 = dragSrcEl.id;
    const itemIndex1 = toDoList.findIndex((item) => item.id === +id1);
    const itemIndex2 = toDoList.findIndex((item) => item.id === +id2);
    [toDoList[itemIndex1], toDoList[itemIndex2]] = [
      toDoList[itemIndex2],
      toDoList[itemIndex1],
    ];
    localStorage.setItem("todo", JSON.stringify(toDoList));
    displayMessages();
  }

  return false;
}

function dragAndDropItems() {
  let items = document.querySelectorAll(".wrapper .item");
  items.forEach(function (item) {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("drop", handleDrop);
  });
}
