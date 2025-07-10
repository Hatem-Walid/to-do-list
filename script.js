let tasks = [];
let currentFilter = "all";
let dragStartIndex = null;

const input = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

addBtn.addEventListener("click", () => addTask());

filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  })
);

const addTask = () => {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    name: text,
    done: false
  });

  input.value = "";
  renderTasks();
};

const renderTasks = () => {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.done;
    if (currentFilter === "incomplete") return !task.done;
    return true;
  });

  filteredTasks.forEach((task, displayIndex) => {
    const actualIndex = tasks.findIndex(t => t.id === task.id); // عشان نعرف ترتيبه الأصلي

    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.setAttribute("data-index", actualIndex);

    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);

    const taskText = document.createElement("span");
    taskText.textContent = task.name;
    if (task.done) taskText.classList.add("done");

    const buttons = document.createElement("div");
    buttons.classList.add("btn-group");

    const toggleBtn = createButton("Toggle", () => toggleTask(task.id));
    const editBtn = createButton("Edit", () => editTask(task.id));
    const deleteBtn = createButton("Delete", () => deleteTask(task.id));

    buttons.append(toggleBtn, editBtn, deleteBtn);
    li.append(taskText, buttons);
    taskList.append(li);
  });
};

const createButton = (label, onClick) => {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
};

const toggleTask = id => {
  const task = tasks.find(t => t.id === id);
  task.done = !task.done;
  renderTasks();
};

const deleteTask = id => {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
};

const editTask = id => {
  const task = tasks.find(t => t.id === id);
  const newName = prompt("Edit task:", task.name);
  if (newName !== null) {
    task.name = newName.trim() || task.name;
    renderTasks();
  }
};

// ✅ drag & drop handlers
const handleDragStart = e => {
  dragStartIndex = +e.currentTarget.dataset.index;
};

const handleDragOver = e => {
  e.preventDefault(); // مهم جدًا عشان drop تشتغل
};

const handleDrop = e => {
  const dragEndIndex = +e.currentTarget.dataset.index;
  swapTasks(dragStartIndex, dragEndIndex);
  renderTasks();
};

const swapTasks = (from, to) => {
  const temp = tasks[from];
  tasks[from] = tasks[to];
  tasks[to] = temp;
};

setInterval(() => {
  if (tasks.length && tasks.every(task => task.done)) {
    console.log("✅ All tasks are done!");
  }
}, 10000);
