const newEvent = document.getElementById("newEvent");

const eventForm = document.getElementById("eventForm");

const saveEvent = document.getElementById("saveEvent");

const cancelEvent = document.getElementById("cancelEvent");

const eventList = document.getElementById("eventList");



let events = JSON.parse(
    localStorage.getItem("memoraEvents")
) || [];







function showEvents(){


    eventList.innerHTML = "";



    events.forEach((event,index)=>{


        let card = document.createElement("div");



        card.className = "event-card";



        card.innerHTML = `


        <h2>

        ${event.title}

        </h2>



        <p>

        ${event.text}

        </p>



        <div class="event-date">

        ${event.date || "Новое событие"}

        </div>



        <button class="event-delete" onclick="deleteEvent(${index})">

        Удалить

        </button>



        `;



        eventList.appendChild(card);



    });


}









// открыть форму


newEvent.onclick = ()=>{


    eventForm.classList.remove("hidden");


    newEvent.classList.add("hidden");


};








// отмена


cancelEvent.onclick = ()=>{


    eventForm.classList.add("hidden");


    newEvent.classList.remove("hidden");


};









// сохранить


saveEvent.onclick = ()=>{


    let title =
    document.getElementById("eventTitle").value;



    let text =
    document.getElementById("eventText").value;





    if(title.trim() === ""){

        return;

    }






    events.push({

        title:title,

        text:text,


        date:new Date().toLocaleDateString("ru-RU")


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








showEvents();