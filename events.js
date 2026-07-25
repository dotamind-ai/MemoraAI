const newEvent =
document.getElementById("newEvent");


const eventForm =
document.getElementById("eventForm");


const saveEvent =
document.getElementById("saveEvent");


const cancelEvent =
document.getElementById("cancelEvent");


const eventList =
document.getElementById("eventList");



let events =
JSON.parse(localStorage.getItem("memoraEvents")) || [];





function showEvents(){


eventList.innerHTML="";



events.forEach((event,index)=>{


let card =
document.createElement("div");


card.className="saved-event";



card.innerHTML=`

<h2>
${event.title}
</h2>

<p>
${event.text}
</p>

<button onclick="deleteEvent(${index})">
Удалить
</button>

`;



eventList.appendChild(card);



});


}






newEvent.onclick=()=>{


eventForm.classList.remove("hidden");


};






cancelEvent.onclick=()=>{


eventForm.classList.add("hidden");


};






saveEvent.onclick=()=>{


let title =
document.getElementById("eventTitle").value;


let text =
document.getElementById("eventText").value;



if(!title){

return;

}



events.push({

title:title,

text:text

});



localStorage.setItem(
"memoraEvents",
JSON.stringify(events)
);



document.getElementById("eventTitle").value="";

document.getElementById("eventText").value="";



eventForm.classList.add("hidden");


showEvents();


};






function deleteEvent(index){


events.splice(index,1);



localStorage.setItem(
"memoraEvents",
JSON.stringify(events)
);



showEvents();


}






function goHome(){

window.location.href="index.html";

}


function goCalendar(){

window.location.href="calendar.html";

}


function goEvents(){

window.location.href="events.html";

}


function goSettings(){

window.location.href="settings.html";

}





showEvents();