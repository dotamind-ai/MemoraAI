/* =====================================
        MEMORA EVENTS JS CLEAN V1
===================================== */


console.log("MEMORA EVENTS CLEAN VERSION");


// ===============================
// ELEMENTS
// ===============================

const newEventBtn = document.getElementById("newEvent");

const eventForm = document.getElementById("eventForm");

const saveEventBtn = document.getElementById("saveEvent");

const cancelEventBtn = document.getElementById("cancelEvent");


const eventList = document.getElementById("eventList");


const titleInput = document.getElementById("eventTitle");

const textInput = document.getElementById("eventText");

const typeInput = document.getElementById("eventType");

const dateInput = document.getElementById("eventDate");



let editIndex = null;



let events =
JSON.parse(
localStorage.getItem("memoraEvents")
) || [];





// ===============================
// SAVE
// ===============================


function saveEvents(){

localStorage.setItem(
"memoraEvents",
JSON.stringify(events)
);

}





// ===============================
// ICONS
// ===============================


function getIcon(type){

const icons = {

idea:"✦",

goal:"◎",

project:"◈",

personal:"◉"

};


return icons[type] || "✦";


}





// ===============================
// RENDER
// ===============================


function renderEvents(){


if(!eventList) return;


eventList.innerHTML="";



events.forEach((event,index)=>{



const card =
document.createElement("div");



card.className =
"event-card " + event.type;



if(event.favorite){

card.classList.add("favorite");

}




card.innerHTML = `


<div class="event-top">


<span class="event-symbol">

${getIcon(event.type)}

</span>


<h2>

${event.title}

</h2>


</div>




<p>

${event.text || "Без описания"}

</p>




<div class="event-date">

📅 ${event.eventDate || "Без даты"}

</div>





<div class="event-actions">


<button class="event-favorite">

${event.favorite ? "★" : "☆"}

</button>



<button class="event-edit">

✎

</button>



<button class="event-delete">

🗑

</button>



</div>


`;






// FAVORITE


card.querySelector(".event-favorite")
.onclick=()=>{


event.favorite =
!event.favorite;


saveEvents();


renderEvents();


};








// EDIT


card.querySelector(".event-edit")
.onclick=()=>{


editIndex=index;


titleInput.value =
event.title;


textInput.value =
event.text;


typeInput.value =
event.type;


dateInput.value =
event.eventDate || "";



eventForm.classList.remove("hidden");


newEventBtn.classList.add("hidden");



saveEventBtn.innerText =
"Update";


};








// DELETE


card.querySelector(".event-delete")
.onclick=()=>{


events.splice(index,1);


saveEvents();


renderEvents();


};






eventList.appendChild(card);



});



}









// ===============================
// NEW EVENT
// ===============================


newEventBtn.onclick=()=>{


editIndex=null;


clearForm();


eventForm.classList.remove("hidden");


newEventBtn.classList.add("hidden");


saveEventBtn.innerText =
"Save";


};









// ===============================
// SAVE BUTTON
// ===============================


saveEventBtn.onclick=()=>{



let title =
titleInput.value.trim();



if(!title){

alert("Enter event title");

return;

}




const data={


title:title,


text:
textInput.value.trim(),


type:
typeInput.value,


eventDate:
dateInput.value,


favorite:false,


created:
Date.now()


};







if(editIndex!==null){


events[editIndex]={


...events[editIndex],


title:data.title,

text:data.text,

type:data.type,

eventDate:data.eventDate


};



editIndex=null;



}

else{


events.unshift(data);


}





saveEvents();


clearForm();



eventForm.classList.add("hidden");


newEventBtn.classList.remove("hidden");


saveEventBtn.innerText="Save";



renderEvents();



};









// ===============================
// CANCEL
// ===============================


cancelEventBtn.onclick=()=>{


editIndex=null;


clearForm();


eventForm.classList.add("hidden");


newEventBtn.classList.remove("hidden");


};









// ===============================
// CLEAR
// ===============================


function clearForm(){


titleInput.value="";

textInput.value="";

dateInput.value="";


}









// ===============================
// NAVIGATION
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









// START

renderEvents();