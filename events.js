console.log("MEMORA EVENTS VERSION 112");


const newEvent = document.getElementById("newEvent");
const eventForm = document.getElementById("eventForm");
const saveEvent = document.getElementById("saveEvent");
const cancelEvent = document.getElementById("cancelEvent");
const eventList = document.getElementById("eventList");


let editIndex = null;


let events = JSON.parse(
    localStorage.getItem("memoraEvents")
) || [];




// ===============================
// Сохранение в память
// ===============================

function saveStorage(){

    localStorage.setItem(
        "memoraEvents",
        JSON.stringify(events)
    );

}






// ===============================
// Иконки типов
// ===============================

function getIcon(type){

    switch(type){

        case "goal":
            return "◎";

        case "note":
            return "▤";

        case "project":
            return "◈";

        case "personal":
            return "◉";

        default:
            return "✦";

    }

}







// ===============================
// Показ карточек
// ===============================

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


        <button class="card-star"
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









// ===============================
// Открыть форму
// ===============================

if(newEvent){


    newEvent.onclick = ()=>{


        editIndex = null;


        eventForm.classList.remove("hidden");


        newEvent.classList.add("hidden");


    };


}










// ===============================
// Отмена
// ===============================

if(cancelEvent){


    cancelEvent.onclick = ()=>{


        eventForm.classList.add("hidden");


        newEvent.classList.remove("hidden");


    };


}










// ===============================
// Сохранение события
// ===============================

if(saveEvent){


saveEvent.onclick = ()=>{


    const titleElement =
    document.getElementById("eventTitle");


    const textElement =
    document.getElementById("eventText");


    const typeElement =
    document.getElementById("eventType");


    const dateElement =
    document.getElementById("eventDate");




    const title =
    titleElement ? titleElement.value : "";



    const text =
    textElement ? textElement.value : "";



    const type =
    typeElement ? typeElement.value : "idea";



    const eventDate =
    dateElement ? dateElement.value : "";







    if(title.trim()===""){


        alert("Введите название события");


        return;


    }







    const newData = {


        title:title,


        text:text,


        type:type,


        eventDate:eventDate,


        favorite:false,


        date:new Date()

        .toLocaleDateString("ru-RU")


    };







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


        events.push(newData);


    }







    saveStorage();







    if(titleElement)
    titleElement.value="";


    if(textElement)
    textElement.value="";


    if(dateElement)
    dateElement.value="";







    eventForm.classList.add("hidden");


    newEvent.classList.remove("hidden");







    showEvents();



};



}










// ===============================
// Избранное
// ===============================

function favoriteEvent(index){



    events[index].favorite =
    !events[index].favorite;



    saveStorage();


    showEvents();


}










// ===============================
// Редактирование
// ===============================

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










// ===============================
// Удаление
// ===============================

function deleteEvent(index){



    events.splice(index,1);


    saveStorage();


    showEvents();



}










// ===============================
// Навигация
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







// запуск

showEvents();