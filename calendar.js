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



let month =
date.getMonth();


let year =
date.getFullYear();



title.textContent =
months[month]+" "+year;





let firstDay =
new Date(year,month,1).getDay();



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





document
.getElementById("prevMonth")
.onclick=()=>{


date.setMonth(
date.getMonth()-1
);


drawCalendar();


};






document
.getElementById("nextMonth")
.onclick=()=>{


date.setMonth(
date.getMonth()+1
);


drawCalendar();


};







// ===== НАВИГАЦИЯ =====



const homeScreen =
document.getElementById("homeScreen");


const calendarScreen =
document.getElementById("calendarScreen");


const navItems =
document.querySelectorAll(".nav-item");






function openScreen(screen){



homeScreen.classList.add("hidden");

calendarScreen.classList.add("hidden");



screen.classList.remove("hidden");



navItems.forEach(item=>{

item.classList.remove("active");

});



}





navItems[0].onclick=()=>{


openScreen(homeScreen);


navItems[0].classList.add("active");


};





navItems[1].onclick=()=>{


openScreen(calendarScreen);


navItems[1].classList.add("active");


};








drawCalendar();