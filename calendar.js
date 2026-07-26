/* =====================================
        MEMORA CALENDAR JS V2
===================================== */


console.log("MEMORA CALENDAR VERSION 2");



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



let calendarDate = new Date();





document.addEventListener("DOMContentLoaded",()=>{


const grid =
document.getElementById("calendarGrid");


const title =
document.getElementById("monthTitle");


const prev =
document.getElementById("prevMonth");


const next =
document.getElementById("nextMonth");





function drawCalendar(){



if(!grid || !title){

return;

}



grid.innerHTML="";



const month =
calendarDate.getMonth();


const year =
calendarDate.getFullYear();





title.textContent =
months[month]+" "+year;







let firstDay =
new Date(
year,
month,
1
).getDay();




if(firstDay===0){

firstDay=7;

}






for(let i=1;i<firstDay;i++){


const empty =
document.createElement("div");


empty.className="calendar-empty";


grid.appendChild(empty);


}







const totalDays =
new Date(
year,
month+1,
0
).getDate();






for(let dayNumber=1;dayNumber<=totalDays;dayNumber++){



const day =
document.createElement("div");



day.className="calendar-day";


day.textContent=dayNumber;





const today =
new Date();





if(

dayNumber===today.getDate()

&&

month===today.getMonth()

&&

year===today.getFullYear()

){

day.classList.add("today");


}






grid.appendChild(day);



}




}









if(prev){


prev.onclick=()=>{


calendarDate.setMonth(

calendarDate.getMonth()-1

);


drawCalendar();


};


}







if(next){


next.onclick=()=>{


calendarDate.setMonth(

calendarDate.getMonth()+1

);


drawCalendar();


};


}








drawCalendar();



});









// ===============================
// НИЖНЯЯ НАВИГАЦИЯ
// ===============================



function goHome(){

window.location.href="index.html";

}



function goCalendar(){

window.location.href="calendar.html";

}



function goEvents(){

window.location.href="events.html";

}



function goProfile(){

window.location.href="profile.html";

}