console.log("MEMORA EVENTS VERSION 110");



const newEvent = document.getElementById("newEvent");
const eventForm = document.getElementById("eventForm");
const saveEvent = document.getElementById("saveEvent");
const cancelEvent = document.getElementById("cancelEvent");
const eventList = document.getElementById("eventList");



let editIndex = null;



let events = JSON.parse(
    localStorage.getItem("memoraEvents")
) || [];





function saveStorage(){

    localStorage.setItem(
        "memoraEvents",
        JSON.stringify(events)
    );

}









function showEvents(){


    if(!eventList){

        console.log("Нет eventList");

        return;

    }



    eventList.innerHTML = "";



    events.forEach((event,index)=>{



        const card = document.createElement("div");



        card.className =
        "event-card " + (event.type || "idea");





        let icon="✦";


        if(event.type==="goal") icon="◎";

        if(event.type==="note") icon="▤";

        if(event.type==="project") icon="◈";

        if(event.type==="personal") icon="◉";







        card.innerHTML = `


<button class="card-star"
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

📅 ${event.eventDate || "Дата не выбрана"}

<br>

Создано: ${event.date || "Сегодня"}

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


    console.log("Открытие формы");


    editIndex=null;


    eventForm.classList.remove("hidden");


    newEvent.classList.add("hidden");


};


}











// отмена


if(cancelEvent){


cancelEvent.onclick = ()=>{


    eventForm.classList.add("hidden");


    newEvent.classList.remove("hidden");


};


}











// сохранение


if(saveEvent){



console.log("Кнопка сохранить найдена");




saveEvent.onclick = ()=>{



console.log("Нажали сохранить");




const titleInput =
document.getElementById("eventTitle");



const textInput =
document.getElementById("eventText");



const typeInput =
document.getElementById("eventType");



const dateInput =
document.getElementById("eventDate");





const title =
titleInput ? titleInput.value : "";



const text =
textInput ? textInput.value : "";



const type =
typeInput ? typeInput.value : "idea";



const eventDate =
dateInput ? dateInput.value : "";








if(title.trim()===""){


console.log("Нет названия");


return;


}







if(editIndex !== null){



events[editIndex].title = title;


events[editIndex].text = text;


events[editIndex].type = type;


events[editIndex].eventDate = eventDate;



console.log("Событие изменено");


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



console.log("Новое событие создано");


}








saveStorage();



console.log(events);








if(titleInput)

titleInput.value="";



if(textInput)

textInput.value="";



if(dateInput)

dateInput.value="";







eventForm.classList.add("hidden");


newEvent.classList.remove("hidden");



editIndex=null;



showEvents();



};



}

else{


console.log("Кнопка saveEvent не найдена");


}











// избранное


function favoriteEvent(index){



events[index].favorite =
!events[index].favorite;



saveStorage();


showEvents();



}









// редактирование


function editEvent(index){



editIndex=index;



const event=events[index];




document.getElementById("eventTitle").value =
event.title || "";



document.getElementById("eventText").value =
event.text || "";





if(document.getElementById("eventType")){


document.getElementById("eventType").value =
event.type || "idea";


}




if(document.getElementById("eventDate")){


document.getElementById("eventDate").value =
event.eventDate || "";


}





eventForm.classList.remove("hidden");


newEvent.classList.add("hidden");



}









// удалить


function deleteEvent(index){



events.splice(index,1);



saveStorage();


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