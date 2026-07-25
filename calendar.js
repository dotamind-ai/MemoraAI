const months=[
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


let date=new Date();



function renderCalendar(){


let grid=document.getElementById("calendarGrid");

let title=document.getElementById("monthTitle");


grid.innerHTML="";



let month=date.getMonth();

let year=date.getFullYear();



title.textContent=
months[month]+" "+year;



let firstDay=
new Date(year,month,1).getDay();



firstDay =
firstDay===0 ? 6 : firstDay-1;




let days=
new Date(year,month+1,0).getDate();





for(let i=0;i<firstDay;i++){


let empty=document.createElement("div");

empty.className="calendar-empty";

grid.appendChild(empty);


}




for(let day=1;day<=days;day++){


let cell=document.createElement("div");


cell.className="calendar-day";


cell.textContent=day;



let today=new Date();



if(
day===today.getDate() &&
month===today.getMonth() &&
year===today.getFullYear()
){

cell.classList.add("today");

}



grid.appendChild(cell);


}


}





document
.getElementById("prevMonth")
.onclick=function(){

date.setMonth(date.getMonth()-1);

renderCalendar();

};





document
.getElementById("nextMonth")
.onclick=function(){

date.setMonth(date.getMonth()+1);

renderCalendar();

};




renderCalendar();