/* =====================================
        MEMORA EVENTS JS CLEAN
===================================== */


console.log("MEMORA EVENTS CLEAN VERSION");



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
)
|| [];





/* ===============================
        STORAGE
=============================== */


function saveStorage(){

localStorage.setItem(
"memoraEvents",
JSON.stringify(events)
);

}







/* ===============================
        ICONS
=============================== */


function getIcon(type){


const icons={


idea:"✦",

goal:"◎",

project:"◈",

personal:"◉"

};


return icons[type] || "✦";


}









/* ===============================
        RENDER
=============================== */


function renderEvents(){


if(!eventList)
return;



eventList.innerHTML="";





events.forEach((event,index)=>{



const card=document.createElement("div");


card.className =
"event-card " + event.type;





card.innerHTML=`


<button class="card-star">

${event.favorite ? "★" : "☆"}

</button>



<div class="event-top">


<span class="event-symbol">

${getIcon(event.type)}

</span>


<h2>

${event.title}

</h2>


</div>




<p>

${event.text || "No description"}

</p>





<div class="event-date">

📅 ${event.eventDate || "No date"}

</div>




<div class="event-actions">


<button class="event-favorite">

★

</button>



<button class="event-edit">

✎

</button>



<button class="event-delete">

×


</button>



</div>



`;








/* избранное */


card.querySelector(".card-star")
.onclick=()=>{


event.favorite=!event.favorite;


saveStorage();


renderEvents();


};








/* редактирование */


card.querySelector(".event-edit")
.onclick=()=>{


editIndex=index;


titleInput.value=event.title;


textInput.value=event.text;


typeInput.value=event.type;


dateInput.value=event.eventDate;



eventForm.classList.remove("hidden");


newEventBtn.classList.add("hidden");


saveEventBtn.innerText="Update";


};








/* удаление */


card.querySelector(".event-delete")
.onclick=()=>{


events.splice(index,1);


saveStorage();


renderEvents();


};







eventList.appendChild(card);



});


}









/* ===============================
        NEW EVENT
=============================== */


newEventBtn.onclick=()=>{


editIndex=null;


clearForm();


eventForm.classList.remove("hidden");


newEventBtn.classList.add("hidden");


saveEventBtn.innerText="Save";


};









/* ===============================
        SAVE
=============================== */


saveEventBtn.onclick=()=>{


let title =
titleInput.value.trim();



if(title===""){


alert("Enter title");


return;


}





let data={


title:title,


text:textInput.value.trim(),


type:typeInput.value,


eventDate:dateInput.value,


favorite:false,


created:Date.now()


};







if(editIndex!==null){


events[editIndex]={

...events[editIndex],

...data,

favorite:events[editIndex].favorite

};


editIndex=null;



}
else{


events.unshift(data);


}







saveStorage();


clearForm();



eventForm.classList.add("hidden");


newEventBtn.classList.remove("hidden");


saveEventBtn.innerText="Save";


renderEvents();



};









/* ===============================
        CANCEL
=============================== */


cancelEventBtn.onclick=()=>{


clearForm();


eventForm.classList.add("hidden");


newEventBtn.classList.remove("hidden");


editIndex=null;


};









function clearForm(){


titleInput.value="";


textInput.value="";


dateInput.value="";


}









/* ===============================
        NAVIGATION
=============================== */


function goHome(){

location.href="index.html";

}


function goCalendar(){

location.href="calendar.html";

}


function goEvents(){

location.href="events.html";

}


function goProfile(){

location.href="profile.html";

}








renderEvents();