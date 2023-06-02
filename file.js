let nameBox = document.querySelector(".username");
let tabs = document.querySelectorAll(".available");
let h1 = document.querySelector(".title");
let tabTitle= document.querySelector(".active .tab-title");
let date = document.querySelector(".date");

//Get h1 title from active class
h1.innerHTML = tabTitle.innerHTML;

//Add username to local storage
if(localStorage.getItem("username") != null){
    nameBox.innerHTML = localStorage.getItem("username");
}else{
    let username = prompt("Please enter your name");
if(username != null){
    nameBox.innerHTML = username;
    localStorage.setItem("username", username);
}
}

//Add active class to current tab
tabs.forEach(tab =>{
    tab.addEventListener("click", (e)=>{
        tabs.forEach(tab =>{
            tab.classList.remove("active");
        });
        tab.classList.add("active");
        h1.innerHTML = tab.children[1].innerHTML;
    })
    
});

//Display date
let d = new Date();
const days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
date.innerHTML = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;








