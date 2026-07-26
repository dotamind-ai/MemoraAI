console.log("MEMORA EVENTS VERSION 111");


const newEvent = document.getElementById("newEvent");
const eventForm = document.getElementById("eventForm");
const saveEvent = document.getElementById("saveEvent");
const cancelEvent = document.getElementById("cancelEvent");
const eventList = document.getElementById("eventList");


let editIndex = null;


let events = JSON.parse(
    localStorage.getItem("memoraEvents")
) || [];




// показать события

function showEvents(){


    if(!eventList){

        console.log("eventList не найден");

        return;

    }



    eventList.innerHTML = "";



    events.forEach((event,index)=>{



        const card = document.createElement("div");


        card.className =
        "event-card " + (event.type || "idea");



        card.innerHTML = `


        <button 
        class="card-star"
        onclick="favoriteEvent(${index})">

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

        ${event.text}

        </p>







        <div class="event-date">

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







function getIcon(type){


    if(type==="goal") return "◎";

    if(type==="note") return "▤";

    if(type==="project") return "◈";

    if(type==="personal") return "◉";


    return "✦";


}









// открыть форму


if(newEvent){


newEvent.onclick = ()=>{


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









// сохранить


if(saveEvent){



saveEvent.onclick = ()=>{



    const title =
    document.getElementById("eventTitle").value;



    const text =
    document.getElementById("eventText").value;



    const type =
    document.getElementById("eventType").value;



    const eventDate =
    document.getElementById("eventDate").value;






    if(title.trim()===""){

        alert("Введите название");

        return;

    }






    if(editIndex !== null){



        events[editIndex] = {


            ...events[editIndex],


            title:title,


            text:text,


            type:type,


            eventDate:eventDate


        };



        editIndex=null;



    }

    else{



        events.push({


            title:title,


            text:text,


            type:type,


            eventDate:eventDate,


            favorite:false,


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









// избранное


function favoriteEvent(index){


    events[index].favorite =

    !events[index].favorite;



    localStorage.setItem(

        "memoraEvents",

        JSON.stringify(events)

    );



    showEvents();


}









// редактировать


function editEvent(index){



    editIndex=index;



    let event=events[index];



    document.getElementById("eventTitle").value =
    event.title;


    document.getElementById("eventText").value =
    event.text;


    document.getElementById("eventType").value =
    event.type;


    document.getElementById("eventDate").value =
    event.eventDate;



    eventForm.classList.remove("hidden");

    newEvent.classList.add("hidden");



}









// удалить


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