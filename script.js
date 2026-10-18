const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let dragElement = null;
const task = document.querySelectorAll(".task");

const cancle = document.querySelector("#cancle");
const addTaskBtn = document.querySelector("#task-toggle");
const modal = document.querySelector(".modal");
const addTask = document.querySelector("#add-new-task");
const title = document.querySelector("#taskTitle");
const description = document.querySelector("#description");

task.forEach(task =>{
    task.addEventListener("drag",(event)=>{
        dragElement = task;
    });
});

addTaskBtn.addEventListener("click",()=>{
    modal.classList.add("active");
});
cancle.addEventListener("click",()=>{
    modal.classList.remove("active");
});

addTask.addEventListener("click",(dets)=>{
    const title = document.querySelector("#taskTitle").value;
    const description = document.querySelector("#description").value;

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable","true");

    div.innerHTML = 
                    `<h2>${title}</h2>
                    <p>${description}</p>
                    <button>Delete</button>`;

    todo.appendChild(div);
    [todo,done,progress].forEach((col)=>{
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector(".right");
        count.innerText = tasks.length;
    });
    div.addEventListener("drag",(event)=>{
        dragElement = div;
    });
    modal.classList.remove("active");
});

function dragEventOnColumn(column) {
    column.addEventListener("dragenter",(event)=>{
        event.preventDefault();
        column.classList.add("hover-over");
    });  
    column.addEventListener("dragleave",(event)=>{
        event.preventDefault();
        column.classList.remove("hover-over");
    });
    column.addEventListener("dragover",(event)=>{
        event.preventDefault();
    });
    column.addEventListener("drop",(event)=>{
        event.preventDefault();
        console.dir("Dropped",dragElement);
        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        [todo,done,progress].forEach((col)=>{
            const tasks = col.querySelectorAll('.task');
            const count = col.querySelector(".right");
            count.innerText = tasks.length;
        });
    });
}

dragEventOnColumn(todo);
dragEventOnColumn(progress);
dragEventOnColumn(done);