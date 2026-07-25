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


let grid = document.getElementById("calendarGrid");
let title = document.getElementById("monthTitle");



if(!grid || !title){

console.log("Календарь не найден");

return;

}



grid.innerHTML = "";



title.innerHTML =
months[currentMonth] + " " + currentYear;




let days =
new Date(
currentYear,
currentMonth + 1,
0
).getDate();





for(let i = 1; i <= days; i++){


let day =
document.createElement("div");


day.className =
"calendar-day";


day.innerHTML = i;



day.onclick = function(){

openMemory(i);

};



grid.appendChild(day);


}



}






function changeMonth(value){


currentMonth += value;



if(currentMonth < 0){

currentMonth = 11;

currentYear--;

}



if(currentMonth > 11){

currentMonth = 0;

currentYear++;

}



renderCalendar();


}







function openMemory(day){


let modal =
document.getElementById("memoryModal");


let date =
document.getElementById("memoryDate");



if(date){

date.innerHTML =
day + " " + months[currentMonth];

}



if(modal){

modal.classList.add("show");

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


let text =
document.getElementById("memoryText");



if(text){

text.value="";

}


closeMemory();


}







window.addEventListener(
"load",
function(){

renderCalendar();

}
);