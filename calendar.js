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



document.addEventListener("DOMContentLoaded", () => {



function drawCalendar(){


const grid = document.getElementById("calendarGrid");
const title = document.getElementById("monthTitle");


if(!grid || !title){
    return;
}


grid.innerHTML="";


let month = date.getMonth();

let year = date.getFullYear();



title.textContent =
months[month] + " " + year;




let firstDay =
new Date(year, month, 1).getDay();



if(firstDay===0){
    firstDay=7;
}




for(let i=1;i<firstDay;i++){

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






const prevMonth =
document.getElementById("prevMonth");


const nextMonth =
document.getElementById("nextMonth");





if(prevMonth){

prevMonth.onclick=()=>{

date.setMonth(date.getMonth()-1);

drawCalendar();

};

}





if(nextMonth){

nextMonth.onclick=()=>{

date.setMonth(date.getMonth()+1);

drawCalendar();

};

}






// НАВИГАЦИЯ


const homeScreen =
document.getElementById("homeScreen");


const calendarScreen =
document.getElementById("calendarScreen");


const navItems =
document.querySelectorAll(".nav-item");





if(homeScreen && calendarScreen && navItems.length>=2){



navItems[0].onclick=()=>{


homeScreen.classList.remove("hidden");

calendarScreen.classList.add("hidden");


navItems.forEach(btn=>btn.classList.remove("active"));

navItems[0].classList.add("active");


};





navItems[1].onclick=()=>{


calendarScreen.classList.remove("hidden");

homeScreen.classList.add("hidden");


navItems.forEach(btn=>btn.classList.remove("active"));

navItems[1].classList.add("active");


};


}






drawCalendar();
const navButtons = document.querySelectorAll(".nav-item");


navButtons.forEach(button => {


    button.addEventListener("click", function(){


        navButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        this.classList.add("active");


    });


});




});
function goHome(){

window.location.href="index.html";

}



function goCalendar(){

window.location.href="calendar.html";

}



function goEvents(){

window.location.href="events.html";

}



function goSettings(){

window.location.href="settings.html";

}