console.log("MEMORA EVENTS VERSION 108");


const newEvent = document.getElementById("newEvent");

const eventForm = document.getElementById("eventForm");

const saveEvent = document.getElementById("saveEvent");

const cancelEvent = document.getElementById("cancelEvent");

const eventList = document.getElementById("eventList");



let editIndex = null;



let events = JSON.parse(
    localStorage.getItem("memoraEvents")
) || [];





events.forEach(event=>{


    if(event.favorite === undefined){

        event.favorite = false;

    }


});









function showEvents(){


    if(!eventList){

        return;

    }



    eventList.innerHTML = "";






    events

    .sort((a,b)=>{

        return b.favorite - a.favorite;

    })

    .forEach((event,index)=>{



        const card = document.createElement("div");



        card.className =

        "event-card " + (event.type || "idea");






        let icon="✦";



        if(event.type==="goal"){

            icon="◎";

        }


        if(event.type==="note"){

            icon="▤";

        }


        if(event.type==="project"){

            icon="◈";

        }


        if(event.type==="personal"){

            icon="◉";

        }









        card.innerHTML = `



<button

class="card-star"

onclick="favoriteEvent(${index})">


${event.favorite ? "★" : "☆"}


</button>








<div class="event-top">


<span class="event-symbol">

${icon}

</span>



<h2>

${event.title}

</h2>


</div>








<p>

${event.text}

</p>







<div class="event-date">


Создано: ${event.date || "Сегодня"}

<br>

📅 ${event.eventDate || "Дата не выбрана"}


</div>








<div class="event-actions">





<button

class="event-edit"

onclick="editEvent(${index})">


✎


</button>







<button

class="event-delete"

onclick="deleteEvent(${index})">


🗑


</button>







</div>





`;





        eventList.appendChild(card);



    });



}









// открыть форму


if(newEvent){


newEvent.onclick = ()=>{


    editIndex=null;


    eventForm.classList.remove("hidden");


    newEvent.classList.add("hidden");


};



}









// отмена


if(cancelEvent){


cancelEvent.onclick = ()=>{


    editIndex=null;


    eventForm.classList.add("hidden");


    newEvent.classList.remove("hidden");


};



}









// сохранить


if(saveEvent){


saveEvent.onclick = ()=>{



const title =

document.getElementById("eventTitle").value;



const text =

document.getElementById("eventText").value;



const typeElement =

document.getElementById("eventType");



const type =

typeElement ? typeElement.value : "idea";




const eventDate =

document.getElementById("eventDate").value;







if(title.trim()===""){

return;

}








if(editIndex !== null){



events[editIndex].title = title;


events[editIndex].text = text;


events[editIndex].type = type;


events[editIndex].eventDate = eventDate;



editIndex=null;



}

else{



events.push({



title:title,



text:text,



type:type,



favorite:false,



eventDate:eventDate,



date:new Date()

.toLocaleDateString("ru-RU")



});



}







localStorage.setItem(

"memoraEvents",

JSON.stringify(events)

);







document.getElementById("eventTitle").value="";


document.getElementById("eventText").value="";


document.getElementById("eventDate").value="";






eventForm.classList.add("hidden");


newEvent.classList.remove("hidden");






showEvents();



};



}









// ⭐ закрепление


function favoriteEvent(index){



events[index].favorite =

!events[index].favorite;







localStorage.setItem(

"memoraEvents",

JSON.stringify(events)

);






showEvents();



}









// ✎ редактирование


function editEvent(index){



editIndex=index;



const event=events[index];






document.getElementById("eventTitle").value=

event.title;





document.getElementById("eventText").value=

event.text;





document.getElementById("eventType").value=

event.type || "idea";





document.getElementById("eventDate").value=

event.eventDate || "";







eventForm.classList.remove("hidden");


newEvent.classList.add("hidden");



}









// 🗑 удаление


function deleteEvent(index){



events.splice(index,1);







localStorage.setItem(

"memoraEvents",

JSON.stringify(events)

);







showEvents();



}









// навигация


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