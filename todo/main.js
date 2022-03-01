let addMessage = document.querySelector('.text-todo'),
  addButton = document.querySelector('.button-plus'),
  toDo = document.querySelector('.todo');

let toDoList = [];

function byField(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
}

if (localStorage.getItem('todo')) {
  toDoList = JSON.parse(localStorage.getItem('todo'));
  displayMessages();
}

addButton.addEventListener('click', function () {
  let newToDo = {
    id: Math.random() * Date.now(),
    toDo: addMessage.value,
    checked: false,
    important: false,
  };
  toDoList.unshift(newToDo);
  displayMessages();
  localStorage.setItem('todo', JSON.stringify(toDoList));
});

function displayMessages() {
  let displayMessage = '';
  toDoList.forEach(function (item, i) {
    displayMessage += `
        <li>
            <input class="todoli" type='checkbox' data-id="${
              item.id
            }" id='item_${i}'  ${item.checked ? 'checked' : ''}>
            <label for='item_${i}'>${
      item.checked ? item.toDo.strike() : item.toDo
    }       </label>
        </li>
    `;
    toDo.innerHTML = displayMessage;
  });
  
  let elem = Array.from(document.querySelectorAll(`.todoli`));
  elem.forEach((item) => {
    item.addEventListener('change', function (event) {
      change(event);
      displayMessages();
    });
  });
}

function change(event) {
  let idInput = event.target.dataset.id;

  for (let i = 0; i < toDoList.length; i++) {
    if (toDoList[i].id == idInput) {
      toDoList[i].checked = !toDoList[i].checked;
      toDoList.sort(byField('checked'));
      localStorage.setItem('todo', JSON.stringify(toDoList));
      break;
    }
  }
}
