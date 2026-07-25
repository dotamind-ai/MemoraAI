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



let now = new Date();


let currentMonth = now.getMonth();

let currentYear = now.getFullYear();






function createCalendar(){



const grid =
document.getElementById("calendarGrid");


const title =
document.getElementById("monthTitle");



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




let days =
new Date(
currentYear,
currentMonth + 1,
0
).getDate();






for(
let i = 1;
i < firstDay;
i++
){


let empty =
document.createElement("div");


empty.className =
"calendar-empty";


grid.appendChild(empty);


}







for(
let day = 1;
day <= days;
day++
){



let cell =
document.createElement("div");



cell.className =
"calendar-day";



cell.textContent =
day;





if(

day === now.getDate() &&
currentMonth === now.getMonth() &&
currentYear === now.getFullYear()

){


cell.classList.add("today");


}




grid.appendChild(cell);



}



}








function changeMonth(step){



currentMonth += step;





if(currentMonth < 0){


currentMonth = 11;

currentYear--;


}




if(currentMonth > 11){


currentMonth = 0;

currentYear++;


}





createCalendar();


}








window.addEventListener(
"DOMContentLoaded",
function(){

createCalendar();

}
);