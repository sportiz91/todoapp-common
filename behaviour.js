//DOM Queries:
const listsContainer = document.querySelector("[data-lists-container]");
const newListFormSubmit = document.querySelector("[data-new-list-form]");
let newListInput = document.querySelector("[data-new-list-input]");
let newTaskInput = document.querySelector("[data-new-task-input]");
const newTaskFormSubmit = document.querySelector("[data-new-task-form]");
const todoHeaderTitle = document.querySelector("[data-todo-header-title]");
const todoHeaderRemaining = document.querySelector(
  "[data-todo-header-remaining]"
);
const tasksContainer = document.querySelector("[data-task-container]");
const theTemplate = document.querySelector("[data-template]");
const clearCompletedTaskButton = document.querySelector(
  "[data-clear-completed-tasks]"
);
const deleteListButton = document.querySelector("[data-delete-list]");
const todoContainer = document.querySelector("[data-todo-container]");

//DOM Queries for localStorage:
let SELECTED_LIST_ID_KEY = "selectedListIdKey";
let SELECTED_LIST_TASKS_KEY = "arrayListsAndTasksKey";
let listsArray =
  JSON.parse(localStorage.getItem(SELECTED_LIST_TASKS_KEY)) || [];
let selectedList = localStorage.getItem(SELECTED_LIST_ID_KEY);

//1. Submit new List.
//2. Add new li to the ul.
//3. Execute function that creates new object with the
//following properties: name, id, array tasks (empty at the
//beggining).
//4. Push the newly object created to the lists array.
//The lists array contains objects. Every object is a different
//list.

newListFormSubmit.addEventListener("submit", (e) => {
  e.preventDefault();

  const newListValue = e.target.firstElementChild.value;

  if (newListValue == "") return;

  const newListObject = addNewList(newListValue);

  listsArray.push(newListObject);
  saveAndRender();
});

listsContainer.addEventListener("click", (e) => {
  if (e.target.classList[0] === "lists-container") return;
  if (todoContainer.style.display === "none") {
    todoContainer.style.display = "";
  }
  if (deleteListButton.style.display === "none") {
    deleteListButton.style.display = "";
  }
  if (clearCompletedTaskButton.style.display === "none") {
    clearCompletedTaskButton.style.display = "";
  }
  selectedList = e.target.id;
  saveAndRender();
});

newTaskFormSubmit.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTaskValue = e.target.firstElementChild.value;

  if (newTaskValue == "") return;

  const newTaskObject = addNewTask(newTaskValue);

  listsArray.forEach((list) => {
    if (selectedList === list.id) {
      list.tasks.push(newTaskObject);
    }
  });

  saveAndRender();
});

tasksContainer.addEventListener("click", (e) => {
  const taskId = e.target.id;

  const myList = listsArray.find((list) => {
    return list.id === selectedList;
  });

  const myTask = myList.tasks.find((task) => {
    return task.id === taskId;
  });

  myTask.complete = e.target.checked;

  saveAndRender();
});

clearCompletedTaskButton.addEventListener("click", (e) => {
  const myList = listsArray.find((list) => list.id === selectedList);

  myList.tasks = myList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

deleteListButton.addEventListener("click", (e) => {
  const listToDelete = listsArray.find((list) => list.id === selectedList);
  listsArray = listsArray.filter((list) => list.id !== listToDelete.id);
  todoContainer.style.display = "none";
  deleteListButton.style.display = "none";
  clearCompletedTaskButton.style.display = "none";
  selectedList = null;
  saveAndRender();
});

function addNewList(newListName) {
  const newListObject = {
    name: newListName,
    id: Date.now().toString(),
    tasks: [],
  };
  return newListObject;
}

function addNewTask(newTaskName) {
  const newTaskObject = {
    name: newTaskName,
    id: Date.now().toString(),
    complete: false,
  };
  return newTaskObject;
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(SELECTED_LIST_TASKS_KEY, JSON.stringify(listsArray));
  localStorage.setItem(SELECTED_LIST_ID_KEY, selectedList);
}

//1. Clear all the elements in My Lists
//2. Add the lists of arrays to the My Lists.

function render() {
  clearListsOrTasks();
  renderLists();

  if (selectedList == "null") {
    todoContainer.style.display = "none";
    deleteListButton.style.display = "none";
    clearCompletedTaskButton.style.display = "none";
  }

  listsArray.forEach((list) => {
    const selectedListId = list.id;
    if (selectedListId === selectedList) {
      renderTasks(list);
      updateListTitle(list);
      updateRemainingTasks(list);
    }
  });
}

function clearListsOrTasks() {
  while (listsContainer.firstElementChild) {
    listsContainer.removeChild(listsContainer.firstElementChild);
  }

  while (tasksContainer.firstElementChild) {
    tasksContainer.removeChild(tasksContainer.firstElementChild);
  }

  newListInput.value = null;
}

function renderLists() {
  listsArray.forEach((list) => {
    const newListItem = document.createElement("li");
    const newListId = list.id;
    newListItem.innerText = list.name;
    newListItem.classList.add("lists-items");
    newListItem.setAttribute("id", newListId);

    if (selectedList === list.id) {
      newListItem.classList.add("active-list");
    }

    listsContainer.appendChild(newListItem);
  });
}

function renderTasks(list) {
  list.tasks.forEach((task) => {
    const importTemplate = document.importNode(theTemplate.content, true);

    importTemplate.querySelector(".task-label").append(task.name);
    importTemplate.querySelector(".task-checkbox").setAttribute("id", task.id);
    importTemplate.querySelector(".task-label").htmlFor = task.id;

    if (task.complete === true) {
      importTemplate.querySelector(".task-checkbox").checked = true;
    }

    tasksContainer.appendChild(importTemplate);
    newTaskInput.value = null;
  });
}

function updateListTitle(list) {
  todoHeaderTitle.innerText = list.name;
}

function updateRemainingTasks(list) {
  const remainingTasks = list.tasks.filter((task) => {
    return !task.complete;
  }).length;

  todoHeaderRemaining.innerText =
    remainingTasks === 1
      ? `${remainingTasks} task remaining`
      : `${remainingTasks} tasks remaining`;
}

render();

// if (document.querySelector(".tasks-container").firstElementChild == null) {
//   todoContainer.style.display = "none";
// }
