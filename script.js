/*-------------------------------------------------Variables-------------------------------------------------------*/

const userNameHolder = document.querySelector(".username");
const tabs = document.querySelectorAll(".available"); 
const allContent = document.querySelectorAll(".content");
const h1 = document.querySelector(".title");
let activeTabTitle = document.querySelector(".active .tab-title");
const date = document.querySelector(".date");
const tasksHolder = document.querySelector(".tasks-holder");
const addTaskBtn = document.querySelector(".add-btn");
const dailyTasksCount = document.querySelector(".daily-tasks");
const importantTasksCount = document.querySelector(".important-tasks");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
let tasksArray =[];
let importantTasksArray =[];
let filteredArray = [];

/*----------------------------------------------------Username-----------------------------------------------------*/

if(localStorage.getItem("username") != null){
    userNameHolder.textContent = localStorage.getItem("username");
}else{
    let username = prompt("Please enter your name"); 
if(username.trim() === ""){
   alert("Username cannot be blank!");
   location.reload();
}else{
    username = username.charAt(0).toLocaleUpperCase() + username.slice(1).toLocaleLowerCase();
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
        tab.classList.add("active");// add active class to the current tab
        h1.textContent = tab.querySelector(".tab-title").textContent; //use the title of the current tab as the main title
        displayTabContent(tab);
        activeTabTitle = tab.querySelector(".tab-title");
    })
});

function displayTabContent(tab){
    const tabTitle = tab.querySelector(".tab-title")
    if (searchInput.value.trim() != "") {
        if(tabTitle.textContent == "My Day"){
            filteredArray = tasksArray.filter(task => task.content.toLocaleLowerCase().includes(searchInput.value.trim().toLocaleLowerCase()));
            addTasksToPage(filteredArray);
        }else if(tabTitle.textContent == "Important"){
            filteredArray = importantTasksArray.filter(task => task.content.toLocaleLowerCase().includes(searchInput.value.trim().toLocaleLowerCase()));
            addTasksToPage(filteredArray);
        }
    }else{
        if(tabTitle.textContent == "My Day"){
            addTasksToPage(tasksArray);
            addTaskBtn.classList.remove("hide");
        }else if(tabTitle.textContent == "Important"){
            addTasksToPage(importantTasksArray);
            addTaskBtn.classList.add("hide");//hide add task button on important page
        }
    }
};

//pass the title of the active tab to h1 on page load
h1.textContent = activeTabTitle.textContent;

/*--------------------------------------------------------Date------------------------------------------------------*/
//Display date
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
    if(activeTabTitle.textContent == "My Day"){
        filteredArray = tasksArray.filter(task => task.content.toLocaleLowerCase().includes(searchInput.value.trim().toLocaleLowerCase()));
        addTasksToPage(filteredArray);
    }else if(activeTabTitle.textContent == "Important"){
        filteredArray = importantTasksArray.filter(task => task.content.toLocaleLowerCase().includes(searchInput.value.trim().toLocaleLowerCase()));
        addTasksToPage(filteredArray);
    }
});


/*--------------------------------------------------------Tasks-----------------------------------------------------*/

if(localStorage.getItem("tasks") !== null){
    if (JSON.parse(localStorage.getItem('tasks')).length !== 0) {
        tasksArray = JSON.parse(localStorage.getItem("tasks")); 
    addTasksToPage(tasksArray);
    //Update the current number of tasks 
    dailyTasksCount.textContent = tasksArray.length;
    //Update important tasks
    importantTasksArray = tasksArray.filter(task => task.important == true);
    importantTasksCount.textContent = importantTasksArray.length;

    }else{
        dailyTasksCount.textContent = tasksArray.length;
        importantTasksCount.textContent = importantTasksArray.length;
        noTasksMessage();//Show "You have no tasks today!"
    }
    
}else{
    dailyTasksCount.textContent = tasksArray.length;
    importantTasksCount.textContent = importantTasksArray.length;
    noTasksMessage();
}

function noTasksMessage(){
    let paragraph = document.createElement("p");
    paragraph.textContent = "You have no tasks today!";
    paragraph.classList.add("message", "text-center", "text-secondary", "mt-5");
    tasksHolder.appendChild(paragraph);
}

//Add a new task
addTaskBtn.addEventListener("click", ()=>{
    let taskValue = prompt("Enter new task");
    if (taskValue != null && taskValue.trim() != "") { 
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
    addTasksToPage(tasksArray); 
    addTasksToLocalStorage(tasksArray);
    //Update the current number of tasks
    dailyTasksCount.textContent = tasksArray.length;
}

function addTasksToLocalStorage(array) {
    localStorage.setItem("tasks", JSON.stringify(array)); 
}

function addTasksToPage(array) {
    tasksHolder.innerHTML = "";
    array.forEach(task =>{
        let taskDiv = document.createElement("div");
        taskDiv.setAttribute("data-id", task.id); //Create an attribute with a unique value for each task
        taskDiv.classList.add("task", "d-flex", "align-items-center", "gap-2", "border-bottom", "mx-4");
        let contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content", "d-flex", "align-items-center", "gap-2", "flex-grow-1", "text-nowrap", "overflow-hidden", "py-2");
        let checkIcon = document.createElement("i");
        checkIcon.classList.add("bi", "bi-circle", "fs-4");
        contentDiv.appendChild(checkIcon);
        let taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.content; //Pass the value of the content property to the taskText element
        contentDiv.appendChild(taskText);
        taskDiv.appendChild(contentDiv);
        let delBtn = document.createElement("button");
        delBtn.classList.add("delete-btn", "text-danger", "bg-transparent", "border-0");
        let delIcon = document.createElement("i");
        delIcon.classList.add("bi", "bi-trash", "fs-4");
        delBtn.appendChild(delIcon);
        taskDiv.appendChild(delBtn);
        let favBtn = document.createElement("button");
        favBtn.classList.add("favorite-btn", "bg-transparent", "border-0");
        let favIcon = document.createElement("i");
        favIcon.classList.add("bi", "bi-star", "fs-4");
        favBtn.appendChild(favIcon);
        taskDiv.appendChild(favBtn);
        tasksHolder.appendChild(taskDiv);

        deleteTask(delBtn);
        styleTaskOnClick(contentDiv);
        addTaskToImportant(favBtn);
        addFilledStarToImportantTasks(task.important, favIcon);
        addStyleToDoneTasks(task.done, contentDiv);
    })
}

function deleteTask(delBtn){
    delBtn.addEventListener("click", ()=>{
        if (confirm("Are you sure you want to delete thi task?")) {
            removeTaskFromLocalStorage(delBtn.parentElement.getAttribute("data-id"));
            if(tasksArray.length === 0){
                noTasksMessage();
            }
        }
    });
}

function removeTaskFromLocalStorage(id) {
    tasksArray = tasksArray.filter(task => task.id != id); 
    addTasksToLocalStorage(tasksArray);//update local storage
    addTasksToPage(tasksArray);
    //Update the current number of tasks
    dailyTasksCount.textContent = tasksArray.length;
    importantTasksArray = tasksArray.filter(task => task.important == true);
    importantTasksCount.textContent = importantTasksArray.length;
}

function styleTaskOnClick(contentDiv){
    contentDiv.addEventListener("click", ()=>{
        contentDiv.parentElement.classList.toggle("done");
        const taskId = contentDiv.parentElement.getAttribute("data-id");
        const checkIcon = contentDiv.querySelector(".bi");
        checkIcon.classList.toggle("bi-circle");
        checkIcon.classList.toggle("bi-check-circle-fill");
        //update done property value
        tasksArray.forEach(task =>{
            if(task.id == taskId){
                task.done == false ? task.done = true : task.done = false;
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
                task.important == false ? task.important = true : task.important = false;
            }
        })
        addTasksToLocalStorage(tasksArray);
        toggleBlueStar(favBtn);
        importantTasksArray = tasksArray.filter(task => task.important == true);
        importantTasksCount.textContent = importantTasksArray.length;
        if(activeTabTitle.textContent == "Important"){
            addTasksToPage(importantTasksArray);
        }
    })
}

function toggleBlueStar(favBtn){
        const favIcon = favBtn.querySelector(".bi");
        favIcon.classList.toggle("bi-star");
        favIcon.classList.toggle("bi-star-fill");
}

function addFilledStarToImportantTasks(important, favIcon){
    if (important) {
        favIcon.classList.toggle("bi-star");
        favIcon.classList.toggle("bi-star-fill");
    }
};

function addStyleToDoneTasks(isDone, contentDiv){
    if (isDone) {
        contentDiv.parentElement.classList.toggle("done");
        const checkIcon = contentDiv.querySelector(".bi");
        checkIcon.classList.toggle("bi-circle");
        checkIcon.classList.toggle("bi-check-circle-fill");
    }
}