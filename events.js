/* =====================================
        MEMORA EVENTS JS V5
===================================== */


console.log("MEMORA EVENTS VERSION 5");



// ЭЛЕМЕНТЫ

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



let events = JSON.parse(

localStorage.getItem("memoraEvents")

) || [];






// ===============================
// СОХРАНЕНИЕ
// ===============================


function saveStorage(){

    localStorage.setItem(
        "memoraEvents",
        JSON.stringify(events)
    );

}







// ===============================
// ИКОНКИ
// ===============================


function getIcon(type){

    const icons = {

        idea:"✦",

        goal:"◎",

        note:"▤",

        project:"◈",

        personal:"◉"

    };


    return icons[type] || "✦";

}








// ===============================
// ПОКАЗ СОБЫТИЙ
// ===============================


function renderEvents(){


    if(!eventList) return;



    eventList.innerHTML="";



    events.forEach((event,index)=>{



        const card=document.createElement("div");



        card.className =
        "event-card " + 
        (event.type || "idea");



        card.innerHTML = `


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

            🗑

            </button>


        </div>


        `;






        // избранное

        card.querySelector(".card-star")
        .onclick=()=>{


            event.favorite =
            !event.favorite;


            saveStorage();

            renderEvents();


        };






        // редактирование

        card.querySelector(".event-edit")
        .onclick=()=>{


            editIndex=index;



            if(titleInput)
            titleInput.value=event.title;



            if(textInput)
            textInput.value=event.text;



            if(typeInput)
            typeInput.value=event.type;



            if(dateInput)
            dateInput.value=event.eventDate;



            if(eventForm)
            eventForm.classList.remove("hidden");



            if(newEventBtn)
            newEventBtn.classList.add("hidden");



            if(saveEventBtn)
            saveEventBtn.innerText="Обновить";


        };








        // удаление


        card.querySelector(".event-delete")
        .onclick=()=>{


            events.splice(index,1);


            saveStorage();


            renderEvents();


        };






        eventList.appendChild(card);



    });



}









// ===============================
// ОТКРЫТИЕ ФОРМЫ
// ===============================


if(newEventBtn){


newEventBtn.onclick=()=>{


    editIndex=null;


    if(saveEventBtn)
    saveEventBtn.innerText="Сохранить";


    if(eventForm)
    eventForm.classList.remove("hidden");


    newEventBtn.classList.add("hidden");


};


}










// ===============================
// ОТМЕНА
// ===============================


if(cancelEventBtn){


cancelEventBtn.onclick=()=>{


    editIndex=null;


    clearForm();



    if(eventForm)
    eventForm.classList.add("hidden");


    if(newEventBtn)
    newEventBtn.classList.remove("hidden");



};


}









// ===============================
// СОХРАНЕНИЕ СОБЫТИЯ
// ===============================


if(saveEventBtn){


saveEventBtn.onclick=()=>{


    const title =
    titleInput?.value.trim() || "";



    const text =
    textInput?.value.trim() || "";



    const type =
    typeInput?.value || "idea";



    const eventDate =
    dateInput?.value || "";







    if(title===""){


        alert("Введите название события");


        return;


    }







    const data={


        title,

        text,

        type,

        eventDate,


        favorite:false,


        created:

        Date.now()


    };








    if(editIndex!==null){



        events[editIndex]={

            ...events[editIndex],

            title,

            text,

            type,

            eventDate


        };



        editIndex=null;



    }

    else{


        events.unshift(data);


    }






    saveStorage();



    clearForm();



    if(eventForm)
    eventForm.classList.add("hidden");



    if(newEventBtn)
    newEventBtn.classList.remove("hidden");



    saveEventBtn.innerText="Сохранить";



    renderEvents();



};



}









// ===============================
// ОЧИСТКА
// ===============================


function clearForm(){


    if(titleInput)
    titleInput.value="";


    if(textInput)
    textInput.value="";


    if(dateInput)
    dateInput.value="";


}









// ===============================
// НАВИГАЦИЯ
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









// СТАРТ


renderEvents();