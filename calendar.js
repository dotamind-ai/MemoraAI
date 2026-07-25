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



const date = new Date();


const currentMonth = date.getMonth();

const currentYear = date.getFullYear();





function createCalendar(){


const grid =
document.getElementById("calendarGrid");


const title =
document.getElementById("monthTitle");



title.textContent =
months[currentMonth] + " " + currentYear;



grid.innerHTML = "";





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


const empty =
document.createElement("div");


empty.className =
"calendar-empty";


grid.appendChild(empty);


}







for(let day = 1; day <= totalDays; day++){



const cell =
document.createElement("div");



cell.className =
"calendar-day";



cell.textContent =
day;




if(

day === date.getDate() &&
currentMonth === date.getMonth() &&
currentYear === date.getFullYear()

){

cell.classList.add("today");

}




grid.appendChild(cell);



}



}




window.addEventListener(
"DOMContentLoaded",
createCalendar
);