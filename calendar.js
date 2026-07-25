const months = [
"Январь",
"Февраль",
"Март",
"Апрель",
"Май",
"Июнь",
"Июль",
"Август",
"Сентябрь",
"Октябрь",
"Ноябрь",
"Декабрь"
];


let date = new Date();



function drawCalendar(){


const grid =
document.getElementById("calendarGrid");


const title =
document.getElementById("monthTitle");



grid.innerHTML="";



let month=date.getMonth();

let year=date.getFullYear();



title.textContent =
months[month]+" "+year;



let first =
new Date(year,month,1).getDay();



if(first===0)
first=7;



for(let i=1;i<first;i++){


let empty=document.createElement("div");

empty.className="calendar-empty";

grid.appendChild(empty);


}





let days =
new Date(year,month+1,0).getDate();





for(let i=1;i<=days;i++){


let day=document.createElement("div");


day.className="calendar-day";


day.textContent=i;



let now=new Date();



if(
i===now.getDate()
&&
month===now.getMonth()
&&
year===now.getFullYear()
){

day.classList.add("today");

}



grid.appendChild(day);


}



}




document.getElementById("prevMonth").onclick=()=>{

date.setMonth(date.getMonth()-1);

drawCalendar();

};



document.getElementById("nextMonth").onclick=()=>{

date.setMonth(date.getMonth()+1);

drawCalendar();

};






// НАВИГАЦИЯ


const buttons =
document.querySelectorAll(".nav-item");



const pages =
document.querySelectorAll(".page");




function openPage(name){



pages.forEach(page=>{

page.classList.add("hidden");

});



if(name==="home")
document.getElementById("homePage")
.classList.remove("hidden");



if(name==="calendar")
document.querySelector(".calendar-container")
.classList.remove("hidden");



if(name==="events")
document.getElementById("eventsPage")
.classList.remove("hidden");



if(name==="settings")
document.getElementById("settingsPage")
.classList.remove("hidden");




buttons.forEach(btn=>{

btn.classList.remove("active");

});



event.currentTarget?.classList.add("active");



}





buttons.forEach(button=>{


button.onclick=(e)=>{


buttons.forEach(b=>b.classList.remove("active"));


button.classList.add("active");


openPage(
button.dataset.page
);



};


});





drawCalendar();