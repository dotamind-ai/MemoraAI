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



function draw(){


let grid=document.getElementById("calendarGrid");

let title=document.getElementById("monthTitle");


grid.innerHTML="";


let month=date.getMonth();

let year=date.getFullYear();



title.textContent=
months[month]+" "+year;



let first=new Date(year,month,1).getDay();


if(first===0) first=7;



for(let i=1;i<first;i++){

let e=document.createElement("div");

e.className="calendar-empty";

grid.appendChild(e);

}



let total=
new Date(year,month+1,0).getDate();



for(let i=1;i<=total;i++){


let d=document.createElement("div");


d.className="calendar-day";


d.textContent=i;



let now=new Date();


if(
i===now.getDate() &&
month===now.getMonth() &&
year===now.getFullYear()
){

d.classList.add("today");

}



grid.appendChild(d);


}


}





document.getElementById("prevMonth").onclick=()=>{

date.setMonth(date.getMonth()-1);

draw();

};



document.getElementById("nextMonth").onclick=()=>{

date.setMonth(date.getMonth()+1);

draw();

};



draw();