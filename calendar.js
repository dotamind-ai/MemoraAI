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



let today = new Date();


let currentMonth = today.getMonth();

let currentYear = today.getFullYear();





function createCalendar(){



const grid = document.getElementById("calendarGrid");

const title = document.getElementById("monthTitle");



grid.innerHTML = "";



title.textContent =
months[currentMonth] + " " + currentYear;





let firstDay =
new Date(
currentYear,
currentMonth,
1
).getDay();



if(firstDay === 0){

firstDay = 7;

}




let totalDays =
new Date(
currentYear,
currentMonth + 1,
0
).getDate();






for(let i = 1; i < firstDay; i++){


let empty =
document.createElement("div");


empty.className =
"calendar-empty";


grid.appendChild(empty);


}







for(let day = 1; day <= totalDays; day++){



let cell =
document.createElement("div");


cell.className =
"calendar-day";


cell.textContent = day;





if(

day === today.getDate() &&
currentMonth === today.getMonth() &&
currentYear === today.getFullYear()

){

cell.classList.add("today");

}




grid.appendChild(cell);


}



}








document
.getElementById("prevMonth")
.onclick = function(){


currentMonth--;



if(currentMonth < 0){

currentMonth = 11;

currentYear--;

}



createCalendar();


};








document
.getElementById("nextMonth")
.onclick = function(){


currentMonth++;



if(currentMonth > 11){

currentMonth = 0;

currentYear++;

}



createCalendar();


};







window.onload = function(){


createCalendar();


};