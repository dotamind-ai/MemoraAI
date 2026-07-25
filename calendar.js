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


let currentDate = new Date();



function drawCalendar(){


const grid =
document.getElementById("calendarGrid");


const title =
document.getElementById("monthTitle");



grid.innerHTML = "";



let month =
currentDate.getMonth();


let year =
currentDate.getFullYear();



title.textContent =
months[month] + " " + year;





let days =
new Date(
year,
month + 1,
0
).getDate();





let start =
new Date(
year,
month,
1
).getDay();



// переводим воскресенье в конец

if(start === 0){

start = 7;

}





// создаём только нужные пустые места

for(let i = 1; i < start; i++){

let empty =
document.createElement("div");

empty.className =
"empty";

grid.appendChild(empty);

}






for(let day = 1; day <= days; day++){


let item =
document.createElement("div");


item.className =
"day";


item.textContent =
day;



let today =
new Date();



if(

day === today.getDate() &&
month === today.getMonth() &&
year === today.getFullYear()

){

item.classList.add("active-day");

}



grid.appendChild(item);



}



}





document
.getElementById("prevMonth")
.onclick = ()=>{


currentDate.setMonth(
currentDate.getMonth()-1
);


drawCalendar();


};





document
.getElementById("nextMonth")
.onclick = ()=>{


currentDate.setMonth(
currentDate.getMonth()+1
);


drawCalendar();


};





drawCalendar();