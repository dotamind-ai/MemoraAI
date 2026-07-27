/* =====================================
        MEMORA EVENTS CLEAN JS
===================================== */


console.log("MEMORA EVENTS CLEAN");



const newEventBtn =
document.getElementById("newEvent");


const eventForm =
document.getElementById("eventForm");


const saveEventBtn =
document.getElementById("saveEvent");


const cancelEventBtn =
document.getElementById("cancelEvent");



const eventList =
document.getElementById("eventList");



const titleInput =
document.getElementById("eventTitle");


const textInput =
document.getElementById("eventText");


const typeInput =
document.getElementById("eventType");


const dateInput =
document.getElementById("eventDate");




let editIndex = null;



let events = JSON.parse(

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


const icons={


idea:"✦",

goal:"◎",

note:"▤",

project:"◈",

personal:"◉"


};



return icons[type] || "✦";


}









// ===============================
// RENDER
// ===============================


function renderEvents(){



if(!eventList)
return;



eventList.innerHTML="";





events.forEach((event,index)=>{



const card =
document.createElement("article");



card.className =

"event-card " +

(event.type || "idea");







card.innerHTML=`


<button class="event-pin ${event.favorite ? "active":""}">

☆

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

${event.text || "Без описания"}

</p>





<div class="event-date">

📅 ${event.eventDate || "Дата не выбрана"}

</div>






<div class="event-actions">


<button class="event-edit">

✎

</button>



<button class="event-delete">

×


</button>


</div>



`;









// закрепить


card
.querySelector(".event-pin")
.onclick=()=>{


events[index].favorite =

!events[index].favorite;



saveEvents();


renderEvents();


};









// редактирование


card
.querySelector(".event-edit")
.onclick=()=>{


editIndex=index;



titleInput.value =
event.title;


textInput.value =
event.text;


typeInput.value =
event.type;


dateInput.value =
event.eventDate;



eventForm.classList.remove(
"hidden"
);



newEventBtn.classList.add(
"hidden"
);



saveEventBtn.innerText =
"Update";


};









// удаление


card
.querySelector(".event-delete")
.onclick=()=>{


events.splice(index,1);



saveEvents();


renderEvents();


};







eventList.appendChild(card);



});



}









// ===============================
// OPEN FORM
// ===============================


newEventBtn.onclick=()=>{


editIndex=null;


eventForm.classList.remove(
"hidden"
);


newEventBtn.classList.add(
"hidden"
);



saveEventBtn.innerText =
"Save";



};









// ===============================
// CANCEL
// ===============================


cancelEventBtn.onclick=()=>{


clearForm();


eventForm.classList.add(
"hidden"
);



newEventBtn.classList.remove(
"hidden"
);



editIndex=null;


};









// ===============================
// SAVE EVENT
// ===============================


saveEventBtn.onclick=()=>{


const title =

titleInput.value.trim();



if(title===""){


alert(
"Введите название события"
);


return;


}





const data={


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



eventForm.classList.add(
"hidden"
);



newEventBtn.classList.remove(
"hidden"
);



saveEventBtn.innerText =
"Save";



renderEvents();



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