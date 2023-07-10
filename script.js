/*-------------------------------------------------Variables-------------------------------------------------------*/

const userNameHolder = document.querySelector(".username");
const tabs = document.querySelectorAll(".available"); 
const allContent = document.querySelectorAll(".content");
const heading = document.querySelector(".title");
let activeTabTitle = document.querySelector(".active .tab-title");
const date = document.querySelector(".date");
const tasksHolder = document.querySelector(".tasks-holder");
const addTaskBtn = document.querySelector(".add-btn");
const dailyTasksCount = document.querySelector(".daily-tasks");
const importantTasksCount = document.querySelector(".important-tasks");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
let tasksArray =[];


/*----------------------------------------------------Username-----------------------------------------------------*/

if(localStorage.getItem("username")){
    userNameHolder.textContent = localStorage.getItem("username");
}else{
    let username = prompt("Please enter your name"); 
if(!username.trim()){
   alert("Username cannot be blank!");
   location.reload();
}else{
    username = `${username.trim().charAt(0).toLocaleUpperCase()}${username.trim().slice(1).toLocaleLowerCase()}`;
    userNameHolder.textContent = username; 
    localStorage.setItem("username", username);
}
}

/*------------------------------------------------------Tabs-------------------------------------------------------*/

//Add active class to current tab
tabs.forEach((tab, index) =>{
    tab.addEventListener("click", ()=>{
        tabs.forEach(tab =>{
            tab.classList.remove("active"); 
        });
        tab.classList.add("active");
        heading.textContent = tab.querySelector(".tab-title").textContent;
        activeTabTitle = tab.querySelector(".tab-title");
        displayTabContent();
    })
});

function displayTabContent(){
       let filteredArray = tasksArray.filter(task => task.content.toLocaleLowerCase().includes(searchInput.value.trim().toLocaleLowerCase()));
       if (filteredArray.length !== 0) {
        if(activeTabTitle.textContent == "My Day"){
            addTasksToPage(filteredArray);
        }else if(activeTabTitle.textContent == "Important"){
            addTasksToPage(filteredArray.filter(task => task.important));
        }
       }else{
        if (!document.querySelector(".message")) {
            addTasksToPage(filteredArray);
            noTasksMessage();
        }
       }
        
};
heading.textContent = activeTabTitle.textContent;

/*--------------------------------------------------------Date------------------------------------------------------*/
let currentDate = new Date();
const days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
date.textContent = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}`;

/*------------------------------------------------------Search-------------------------------------------------------*/

searchBtn.addEventListener("click", ()=>{
    const inputWrapper = document.querySelector(".input-wrapper");
    inputWrapper.classList.toggle("input-visible");
    searchInput.value = "";
    searchInput.focus();
});

searchInput.addEventListener("input", ()=>{
    displayTabContent();
});

/*--------------------------------------------------------Tasks-----------------------------------------------------*/

if(localStorage.getItem("tasks") && JSON.parse(localStorage.getItem('tasks')).length !== 0){
        tasksArray = JSON.parse(localStorage.getItem("tasks")); 
    addTasksToPage(tasksArray);
    dailyTasksCount.textContent = tasksArray.length;
    importantTasksCount.textContent = tasksArray.filter(task => task.important).length;

    }else{
        dailyTasksCount.textContent = tasksArray.length;
        importantTasksCount.textContent = tasksArray.filter(task => task.important).length;
        noTasksMessage();//Show "You have no tasks today!"
    }

function noTasksMessage(){
    let paragraph = document.createElement("p");
    paragraph.textContent = "No tasks to show!";
    paragraph.classList.add("message", "text-center", "text-secondary", "mt-5");
    tasksHolder.appendChild(paragraph);
}

//Add a new task
addTaskBtn.addEventListener("click", ()=>{
    let taskValue = prompt("Enter new task");
    if (taskValue.trim()) { 
        addTaskToArray(taskValue); 
    }
});

function addTaskToArray(taskValue) {
    const task = {
        id: Date.now(), 
        content: taskValue, 
        important: false,
        done: false,
    }
    tasksArray.unshift(task); 
    displayTabContent();
    addTasksToLocalStorage(tasksArray);
    //Update the current number of tasks
    dailyTasksCount.textContent = tasksArray.length;
}

function addTasksToLocalStorage(array) {
    localStorage.setItem("tasks", JSON.stringify(array)); 
}
function createTaskDiv(taskId, taskContent, isImportant, isDone){
    let taskDiv = document.createElement("div");
        taskDiv.setAttribute("data-id", taskId);
        taskDiv.classList.add("task", "d-flex", "align-items-center", "gap-2", "border-bottom", "mx-4");
        createContentDiv(taskDiv,taskContent, isDone);
        createDeleteBtn(taskDiv);
        createFavoriteBtn(taskDiv, isImportant);
        tasksHolder.appendChild(taskDiv);
}

function createContentDiv(taskDiv, taskContent, isDone) {
    let contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content", "d-flex", "align-items-center", "gap-2", "flex-grow-1", "text-nowrap", "overflow-hidden", "py-2");
        taskDiv.appendChild(contentDiv);
        createCheckIcon(contentDiv);
        createTaskText(contentDiv, taskContent);
        styleTaskOnClick(contentDiv);
        addStyleToDoneTasks(isDone, contentDiv);
}

function createCheckIcon(contentDiv) {
    let checkIcon = document.createElement("i");
        checkIcon.classList.add("bi", "bi-circle", "fs-4");
        contentDiv.appendChild(checkIcon);
}

function createTaskText(contentDiv, taskContent) {
    let taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = taskContent; //Pass the value of the content property to the taskText element
        contentDiv.appendChild(taskText);
}

function createDeleteBtn(taskDiv) {
    let delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn", "text-danger", "bg-transparent", "border-0");
    taskDiv.appendChild(delBtn);
    createDeleteIcon(delBtn);
    deleteTask(delBtn);
}

function createDeleteIcon(delBtn){
    let delIcon = document.createElement("i");
        delIcon.classList.add("bi", "bi-trash", "fs-4");
        delBtn.appendChild(delIcon);
}

function createFavoriteBtn(taskDiv, isImportant){
    let favBtn = document.createElement("button");
        favBtn.classList.add("favorite-btn", "bg-transparent", "border-0");
        taskDiv.appendChild(favBtn);
        createFavoriteIcon(favBtn, isImportant);
        addTaskToImportant(favBtn);
}

function createFavoriteIcon(favBtn, isImportant){
    let favIcon = document.createElement("i");
        favIcon.classList.add("bi", "bi-star", "fs-4");
        favBtn.appendChild(favIcon);
        addFilledStarToImportantTasks(isImportant, favIcon);
}

function addTasksToPage(array) {
    tasksHolder.innerHTML = "";
    array.forEach(task =>{
        createTaskDiv(task.id, task.content, task.important, task.done);
    })
}

function deleteTask(delBtn){
    delBtn.addEventListener("click", ()=>{
        if (confirm("Are you sure you want to delete thi task?")) {
            removeTaskFromLocalStorage(delBtn.parentElement.getAttribute("data-id"));
        }
    });
}

function removeTaskFromLocalStorage(id) {
    tasksArray = tasksArray.filter(task => task.id != id); 
    addTasksToLocalStorage(tasksArray);//update local storage
    displayTabContent();
    dailyTasksCount.textContent = tasksArray.length;
    importantTasksCount.textContent = tasksArray.filter(task => task.important).length;
}

function styleTaskOnClick(contentDiv){
    contentDiv.addEventListener("click", ()=>{
        const taskId = contentDiv.parentElement.getAttribute("data-id");
        tasksArray.forEach(task =>{
            if(task.id == taskId){
                task.done = !task.done;
                addStyleToDoneTasks(task.done, contentDiv)
            }
        })
        addTasksToLocalStorage(tasksArray);
      });
}

function addTaskToImportant(favBtn){
    favBtn.addEventListener("click", ()=>{
        const taskId = favBtn.parentElement.getAttribute("data-id");
        //update important propety value
        tasksArray.forEach(task =>{
            if(task.id == taskId){
                task.important = !task.important;
                addFilledStarToImportantTasks(task.important, favBtn.querySelector(".bi"))
            }
        })
        addTasksToLocalStorage(tasksArray);
        importantTasksCount.textContent = tasksArray.filter(task => task.important).length;
        displayTabContent();
    })
}

function addFilledStarToImportantTasks(important, favIcon){
    if (important) {
        favIcon.classList.remove("bi-star");
        favIcon.classList.add("bi-star-fill");
    }else{
        favIcon.classList.remove("bi-star-fill");
        favIcon.classList.add("bi-star");
    }
};

function addStyleToDoneTasks(isDone, contentDiv){
    
        const checkIcon = contentDiv.querySelector(".bi");
    if (isDone) {
        contentDiv.parentElement.classList.add("done");
        checkIcon.classList.remove("bi-circle");
        checkIcon.classList.add("bi-check-circle-fill");
    }else{
        contentDiv.parentElement.classList.remove("done");
        checkIcon.classList.add("bi-circle");
        checkIcon.classList.remove("bi-check-circle-fill");
    }
}