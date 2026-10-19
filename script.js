
let tasks = [];

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const cancle = document.querySelector("#cancle");
const addTaskBtn = document.querySelector("#task-toggle");
const modal = document.querySelector(".modal");
const addTask = document.querySelector("#add-new-task");
const titleInput = document.querySelector("#taskTitle");
const descriptionInput = document.querySelector("#description");

let dragElement = null;

// Map each status to its column
const columns = {
    todo,
    progress,
    done
};

// Save all tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load saved tasks
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem("tasks");
        tasks = savedTasks ? JSON.parse(savedTasks) : [];

        if (!Array.isArray(tasks)) {
            tasks = [];
        }
    } catch (error) {
        console.error("Unable to load saved tasks:", error);
        tasks = [];
    }
}

// Update column task counts
function updateCounts() {
    Object.values(columns).forEach(column => {
        const count = column.querySelector(".right");

        if (count) {
            count.textContent =
                column.querySelectorAll(".task").length;
        }
    });
}

// Create one task card
function createTaskCard(task) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.dataset.id = task.id;

    const heading = document.createElement("h2");
    heading.textContent = task.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = task.description;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";

    deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter(item => item.id !== task.id);

        saveTasks();
        renderTasks();
    });

    // Remember which card is being dragged
    div.addEventListener("dragstart", event => {
        dragElement = div;
        event.dataTransfer.setData("text/plain", String(task.id));
        event.dataTransfer.effectAllowed = "move";
    });

    div.addEventListener("dragend", () => {
        dragElement = null;

        Object.values(columns).forEach(column => {
            column.classList.remove("hover-over");
        });
    });

    div.append(heading, paragraph, deleteBtn);

    return div;
}

// Render all tasks from the data array
function renderTasks() {
    Object.values(columns).forEach(column => {
        column.querySelectorAll(".task").forEach(card => {
            card.remove();
        });
    });

    tasks.forEach(task => {
        const column = columns[task.status];

        if (column) {
            column.appendChild(createTaskCard(task));
        }
    });

    updateCounts();
}

// Open modal
addTaskBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

// Close modal
cancle.addEventListener("click", () => {
    modal.classList.remove("active");
});

// Add a new task
addTask.addEventListener("click", event => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        titleInput.focus();
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        status: "todo"
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    titleInput.value = "";
    descriptionInput.value = "";
    modal.classList.remove("active");
});

// Configure drag-and-drop columns
function dragEventOnColumn(column) {
    column.addEventListener("dragenter", event => {
        event.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", event => {
        // Avoid removing the highlight when entering a child
        if (!column.contains(event.relatedTarget)) {
            column.classList.remove("hover-over");
        }
    });

    column.addEventListener("dragover", event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    });

    column.addEventListener("drop", event => {
        event.preventDefault();
        column.classList.remove("hover-over");

        const id = event.dataTransfer.getData("text/plain");

        if (!id) return;

        const task = tasks.find(item => String(item.id) === id);

        if (!task) return;

        // Update the data, not just the DOM
        task.status = column.id;

        saveTasks();
        renderTasks();
    });
}

// Register drag-and-drop for all columns
Object.values(columns).forEach(dragEventOnColumn);

// Restore saved data and display the board
loadTasks();
renderTasks();
