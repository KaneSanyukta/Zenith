const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let dragElement = null;
const task = document.querySelectorAll(".task");

task.forEach(task =>{
    task.addEventListener("drag",(event)=>{
        dragElement = task;
    });
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
    });
}

dragEventOnColumn(todo);
dragEventOnColumn(progress);
dragEventOnColumn(done);