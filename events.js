console.log("MEMORA EVENTS VERSION 99");

const newEvent = document.getElementById("newEvent");

const eventForm = document.getElementById("eventForm");

const saveEvent = document.getElementById("saveEvent");

const cancelEvent = document.getElementById("cancelEvent");

const eventList = document.getElementById("eventList");



let events = JSON.parse(
    localStorage.getItem("memoraEvents")
) || [];




// ===== ПОКАЗ СОБЫТИЙ =====


function showEvents(){


    if(!eventList){
        return;
    }


    eventList.innerHTML = "";



    events.forEach((event,index)=>{



        const card = document.createElement("div");


        card.className = 
"event-card " + (event.type || "idea");



        card.innerHTML = `

        <h2>
        ${event.title}
        </h2>


        <p>
        ${event.text}
        </p>


        <div class="event-date">

        ${event.date || "Сегодня"}

        </div>



        <button class="event-delete"
        onclick="deleteEvent(${index})">

        Удалить

        </button>

        `;



        eventList.appendChild(card);



    });



}








// ===== ОТКРЫТЬ ФОРМУ =====


if(newEvent){


newEvent.onclick = ()=>{


    eventForm.classList.remove("hidden");


    newEvent.classList.add("hidden");


};


}









// ===== ОТМЕНА =====


if(cancelEvent){


cancelEvent.onclick = ()=>{


    eventForm.classList.add("hidden");


    newEvent.classList.remove("hidden");


};


}









// ===== СОХРАНЕНИЕ =====


if(saveEvent){


saveEvent.onclick = ()=>{



    const title =
    document.getElementById("eventTitle").value;



    const text =
    document.getElementById("eventText").value;





    if(title.trim() === ""){

        
        const type =
document.getElementById("eventType").value;


events.push({

title:title,

text:text,

type:type,

date:new Date()
.toLocaleDateString("ru-RU")

});







    localStorage.setItem(

        "memoraEvents",

        JSON.stringify(events)

    );








    document.getElementById("eventTitle").value="";


    document.getElementById("eventText").value="";






    eventForm.classList.add("hidden");


    newEvent.classList.remove("hidden");




    showEvents();



};


}









// ===== УДАЛЕНИЕ =====


function deleteEvent(index){



    events.splice(index,1);



    localStorage.setItem(

        "memoraEvents",

        JSON.stringify(events)

    );



    showEvents();


}







// ===== НАВИГАЦИЯ =====



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







// запуск


showEvents();