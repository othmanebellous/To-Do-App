/*-------------------------------------------------Variables-------------------------------------------------------*/

let userNameHolder = document.querySelector(".username");
let tabs = document.querySelectorAll(".available"); //Select all tabs with class available
let allContent = document.querySelectorAll(".content");//Select all divs with class content
let h1 = document.querySelector(".title");
let activeTabTitle = document.querySelector(".active .tab-title");
let date = document.querySelector(".date");
let tasksHolder = document.querySelector(".tasks-holder");
let importantTasksHolder = document.querySelector(".important-tasks-holder");
let addTaskBtn = document.querySelector(".add-btn");
let dailyTasksCount = document.querySelector(".daily-tasks");
let importantTasksCount = document.querySelector(".important-tasks");
let searchInput = document.querySelector(".search-input");

/*----------------------------------------------------Username-----------------------------------------------------*/

//Check if username exists in local storage
if(localStorage.getItem("username") != null){
    userNameHolder.innerHTML = localStorage.getItem("username"); //if yes pass it to userNameHolder
}else{
    let username = prompt("Please enter your name"); //if no get the value inserted by the user
if(username === ""){
    username = "Unknown"; //if the value is empty the username is Unknown
    addUsernameToLocalStorage(username); //add username to local storage
}else{
    addUsernameToLocalStorage(username);
}
}

function addUsernameToLocalStorage(username) {
    userNameHolder.innerHTML = username; 
    localStorage.setItem("username", username);
}

/*------------------------------------------------------Tabs-------------------------------------------------------*/

//Add active class to current tab
tabs.forEach((tab, index) =>{
    tab.addEventListener("click", (e)=>{
        tabs.forEach(tab =>{
            tab.classList.remove("active"); //remove active class from all tabs
        });
        tab.classList.add("active");// add active class to the current tab
        h1.innerHTML = tab.querySelector(".tab-title").innerHTML; //use the title of the current tab as the main title
        allContent.forEach(content => content.classList.add("hide")); // add hide class to all content divs
        allContent[index].classList.remove("hide");// remove hide from the content div with the same index of the current tab
    })
});

//pass the title of the active tab to h1 on page load
h1.innerHTML = activeTabTitle.innerHTML;

/*--------------------------------------------------------Date------------------------------------------------------*/
//Display date
let d = new Date();
const days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
date.innerHTML = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;

/*--------------------------------------------------------Tasks-----------------------------------------------------*/

//Empty arrays to store tasks
let tasksArray =[];
let importantTasks= [];

//Check if there is an array of tasks in local storage
if(localStorage.getItem("tasks") !== null){
    tasksArray = JSON.parse(localStorage.getItem("tasks")); //if yes pass the tasks in local storage to tasksArray
    addTasksToPage(tasksArray);//Add tasks to page
    //Update the current number of tasks 
    dailyTasksCount.innerHTML = tasksArray.length;
}else{
    //Update the current number of tasks (in this case we have 0 tasks)
    dailyTasksCount.innerHTML = tasksArray.length;
}

//Check if there is an array of important tasks in local storage
if(localStorage.getItem("importantTasks") !== null){
    importantTasks = JSON.parse(localStorage.getItem("importantTasks"));//if yes pass the tasks in local storage to importantTasks
    addImportantTasksToPage(importantTasks);//Add tasks to important page
    //Update the current number of important tasks 
    importantTasksCount.innerHTML = importantTasks.length;
}else{
    importantTasksCount.innerHTML = importantTasks.length;
}

//Add a new task
addTaskBtn.addEventListener("click", ()=>{
    let taskValue = prompt("Enter new task"); //get the value inserted by the user
    if (taskValue != null && taskValue != "") { //check if the value is not empty
        addTaskToArray(taskValue); //pass the value as an argument to the function
    }
});

function addTaskToArray(taskValue) {
    const task = {
        id: Date.now(), //create a unique id for each task
        content: taskValue, //pass the value inserted by the user to the content property
    }
    tasksArray.unshift(task); //add the task object to the array of tasks
    addTasksToPage(tasksArray); //pass the array of tasks as an argument to the addTasksToPage function
    addTasksToLocalStorage(tasksArray);//pass the array of tasks as an argument to the addTasksToLocalStorage function
    //Update the current number of tasks
    dailyTasksCount.innerHTML = tasksArray.length;
}

function addTasksToLocalStorage(array) {
    localStorage.setItem("tasks", JSON.stringify(array)); //convert array to string and pass it to local storage
}


function addTasksToPage(array) {
    tasksHolder.innerHTML = ""; //remove any existing tasks from the tasksHolder div
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
        taskText.innerHTML = task.content; //Pass the value of the content property to the taskText element
        contentDiv.appendChild(taskText);
        taskDiv.appendChild(contentDiv);
        let delBtn = document.createElement("button");
        delBtn.classList.add("delete-btn", "hide", "text-danger", "bg-transparent", "border-0");
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

        //delete a task
        delBtn.addEventListener("click", ()=>{
            if (confirm("Are you sure you want to delete thi task?")) {
                removeTaskFromLocalStorage(delBtn.parentElement.getAttribute("data-id")); //pass the unique value of the data-id attribute as an argument
                removeImportantTaskFromLocal(delBtn.parentElement.getAttribute("data-id"));
                addImportantTasksToPage(importantTasks);
            }
        });

        function removeTaskFromLocalStorage(id) {
            tasksArray = tasksArray.filter(task => task.id != id); //filter the task that has the same id of the one we want to delete
            addTasksToLocalStorage(tasksArray); //pass the filtered array to local storage
            addTasksToPage(tasksArray);//display the filtered tasks on the page 
            //Update the current number of tasks
            dailyTasksCount.innerHTML = tasksArray.length;
        }

        contentDiv.addEventListener("click", ()=>{
            //Add done class to selected task
            taskDiv.classList.toggle("done");
        
            //toggle between checked and unchecked icon on click
            toggleCheckIcon(checkIcon);
            
            //On click replace favorite icon with delete icon
            if(delBtn.classList.contains("hide")){
            favBtn.classList.add("hide");
            delBtn.classList.remove("hide");
            }else{
            delBtn.classList.add("hide");
            favBtn.classList.remove("hide");
            }
          });

          //add tasks to important
          favBtn.addEventListener("click", ()=>{
            if(importantTasks.some(task => task.id == favBtn.parentElement.getAttribute("data-id"))){ //if the task already exists in important tasks
                removeImportantTaskFromLocal(task.id); //remove task from importan tasks
                favIcon.classList.remove("bi-star-fill"); //remove filled star icon
                favIcon.classList.add("bi-star");//add normal star icon
            }else{// else add the task to important tasks
                const importanTask = {
                    id: favBtn.parentElement.getAttribute("data-id"), //create a unique id for each task
                    content: favBtn.parentElement.querySelector(".task-text").innerHTML, //pass the value inserted by the user to the content property
                }
                importantTasks.unshift(importanTask);//add the task object to the array of Important tasks
                addImportantTasksToLocal(importantTasks);
                addImportantTasksToPage(importantTasks);
                favIcon.classList.remove("bi-star");//remove normal star icon
                favIcon.classList.add("bi-star-fill");//add filled star icon
                importantTasksCount.innerHTML = importantTasks.length;
            }
          })
    });
    //add a filled star icon to important tasks
    addFilledStarToImportantTasks()
}

function toggleCheckIcon(checkIcon){
    if(checkIcon.classList.contains("bi-circle")){
        checkIcon.classList.remove("bi-circle");
        checkIcon.classList.add("bi-check-circle-fill");
      }else{
        checkIcon.classList.remove("bi-check-circle-fill");
        checkIcon.classList.add("bi-circle");
      };
}

function addImportantTasksToLocal(array) {
    localStorage.setItem("importantTasks", JSON.stringify(array)); //convert array to string and pass it to local storage
}

function addImportantTasksToPage(array){
    importantTasksHolder.innerHTML = "";
    array.forEach(task =>{
        let taskDiv = document.createElement("div");
        taskDiv.setAttribute("data-id", task.id);
        taskDiv.classList.add("task", "d-flex", "align-items-center", "gap-2", "border-bottom", "mx-4");
        let contentDiv = document.createElement("div");
        contentDiv.classList.add("task-content", "d-flex", "align-items-center", "gap-2", "flex-grow-1", "text-nowrap", "overflow-hidden", "py-2");
        let checkIcon = document.createElement("i");
        checkIcon.classList.add("bi", "bi-circle", "fs-4");
        contentDiv.appendChild(checkIcon);
        let taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.innerHTML = task.content;
        contentDiv.appendChild(taskText);
        taskDiv.appendChild(contentDiv);
        let delBtn = document.createElement("button");
        delBtn.classList.add("delete-btn", "hide", "text-danger", "bg-transparent", "border-0");
        let delIcon = document.createElement("i");
        delIcon.classList.add("bi", "bi-trash", "fs-4");
        delBtn.appendChild(delIcon);
        taskDiv.appendChild(delBtn);
        importantTasksHolder.appendChild(taskDiv);

          //delete Important task
          delBtn.addEventListener("click", ()=>{
            if (confirm("Are you sure you want to delete this task?")) {
                removeImportantTaskFromLocal(delBtn.parentElement.getAttribute("data-id"));
            }
        })

        contentDiv.addEventListener("click", ()=>{
            //Add done class to selected task
            taskDiv.classList.toggle("done");
        
            //toggle between checked and unchecked icon on click
            toggleCheckIcon(checkIcon);

            //On click show delete icon
            if(delBtn.classList.contains("hide")){
                delBtn.classList.remove("hide");
                }else{
                delBtn.classList.add("hide");
                }
          });
    })
    addFilledStarToImportantTasks();
}

function removeImportantTaskFromLocal(id) {
    importantTasks = importantTasks.filter(task => task.id != id); //filter the task that has the same id of the one we want to delete
    addImportantTasksToLocal(importantTasks); //pass the filtered array to local storage
    addImportantTasksToPage(importantTasks);//display the filtered tasks on the page 
    //Update the current number of tasks
    importantTasksCount.innerHTML = importantTasks.length;

    addTasksToPage(tasksArray)

}

function addFilledStarToImportantTasks(){
    importantTasks.forEach(importantTask =>{
        tasksArray.forEach(normalTask =>{
            if (importantTask.id == normalTask.id) {
                let taskDiv = document.querySelector(`.tasks-holder [data-id = "${normalTask.id}"]`);
                taskDiv.querySelector(".favorite-btn .bi").classList.remove("bi-star");//remove normal star icon
                taskDiv.querySelector(".favorite-btn .bi").classList.add("bi-star-fill");//add filled star icon
            }
        })
    })
}

/*------------------------------------------------------Search-------------------------------------------------------*/

searchInput.addEventListener("input", (e)=>{
    let allTasks = document.querySelectorAll(".tasks-holder .task");//get all tasks
        allTasks.forEach(taskEl => {
            let isVisible = taskEl.querySelector(".task-text").innerHTML.toLowerCase().includes(e.target.value.toLowerCase());//returns true or false
            taskEl.classList.toggle("hide", !isVisible)
            
        })
});
