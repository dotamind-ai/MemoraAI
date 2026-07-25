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


let currentDate=new Date();



function renderCalendar(){


const grid=document.getElementById("calendarGrid");

const title=document.getElementById("monthTitle");


grid.innerHTML="";


let month=currentDate.getMonth();

let year=currentDate.getFullYear();



title.textContent=
months[month]+" "+year;




let firstDay=
new Date(year,month,1).getDay();



if(firstDay===0){

firstDay=7;

}



let days=
new Date(year,month+1,0).getDate();




for(let i=1;i<firstDay;i++){


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





document.getElementById("prevMonth").onclick=()=>{

currentDate.setMonth(
currentDate.getMonth()-1
);

renderCalendar();

};



document.getElementById("nextMonth").onclick=()=>{

currentDate.setMonth(
currentDate.getMonth()+1
);

renderCalendar();

};



renderCalendar();