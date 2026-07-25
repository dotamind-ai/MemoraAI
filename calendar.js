const monthNames = [
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



let grid = document.getElementById("calendarGrid");

let title = document.getElementById("monthTitle");



grid.innerHTML = "";



title.innerHTML =
monthNames[currentMonth] +
" " +
currentYear;





let firstDay = new Date(
currentYear,
currentMonth,
1
).getDay();





if(firstDay === 0){

firstDay = 7;

}





let daysInMonth = new Date(
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







for(let day = 1; day <= daysInMonth; day++){



let cell =
document.createElement("div");



cell.className =
"calendar-day";



cell.innerHTML =
day;





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






window.onload = function(){


createCalendar();


};