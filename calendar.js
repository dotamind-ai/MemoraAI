let currentMonth = 6;
let currentYear = 2026;


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



function renderCalendar(){


const grid = document.getElementById("calendarGrid");
const title = document.getElementById("monthTitle");


if(!grid){

console.log("calendarGrid не найден");

return;

}



grid.innerHTML="";


title.innerHTML =
months[currentMonth]+" "+currentYear;



let daysInMonth =
new Date(
currentYear,
currentMonth+1,
0
).getDate();



for(let i=1;i<=daysInMonth;i++){


let day =
document.createElement("div");


day.className="calendar-day";


day.textContent=i;



day.onclick=function(){

openMemory(i);

};



grid.appendChild(day);


}


}






function changeMonth(step){


currentMonth += step;


if(currentMonth < 0){

currentMonth=11;

currentYear--;

}



if(currentMonth > 11){

currentMonth=0;

currentYear++;

}



renderCalendar();


}







function openMemory(day){


let modal =
document.getElementById("memoryModal");


let date =
document.getElementById("memoryDate");



if(modal){

modal.classList.add("show");

}



if(date){

date.innerHTML =
day+" "+months[currentMonth];

}


}






function closeMemory(){


let modal =
document.getElementById("memoryModal");


if(modal){

modal.classList.remove("show");

}


}






function saveMemory(){


closeMemory();


}







window.addEventListener(
"load",
function(){

renderCalendar();

}
);