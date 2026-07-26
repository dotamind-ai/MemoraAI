console.log("MEMORA EVENTS VERSION 104");


const newEvent = document.getElementById("newEvent");

const eventForm = document.getElementById("eventForm");

const saveEvent = document.getElementById("saveEvent");

const cancelEvent = document.getElementById("cancelEvent");

const eventList = document.getElementById("eventList");





let events = JSON.parse(
    localStorage.getItem("memoraEvents")
) || [];





// добавляем favorite старым событиям

events.forEach(event=>{


    if(event.favorite === undefined){

        event.favorite = false;

    }


});









// ===== ПОКАЗ СОБЫТИЙ =====


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








        let icon = "✦";



        if(event.type === "goal"){

            icon = "◎";

        }


        if(event.type === "note"){

            icon = "▤";

        }


        if(event.type === "project"){

            icon = "◈";

        }


        if(event.type === "personal"){

            icon = "◉";

        }









        card.innerHTML = `



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

            ${event.date || "Сегодня"}

        </div>








        <div class="event-actions">



            <button

            class="event-favorite"

            onclick="favoriteEvent(${index})">


                ${event.favorite ? "★" : "☆"}


            </button>







            <button

            class="event-delete"

            onclick="deleteEvent(${index})">


                Удалить


            </button>



        </div>







        `;






        eventList.appendChild(card);




    });






}









// ===== ОТКРЫТИЕ ФОРМЫ =====



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







    const typeElement =

    document.getElementById("eventType");





    const type =

    typeElement ? typeElement.value : "idea";








    if(title.trim() === ""){


        return;


    }








    events.push({



        title:title,



        text:text,



        type:type,



        favorite:false,



        date:new Date()

        .toLocaleDateString("ru-RU")



    });









    localStorage.setItem(

        "memoraEvents",

        JSON.stringify(events)

    );








    document.getElementById("eventTitle").value = "";


    document.getElementById("eventText").value = "";








    eventForm.classList.add("hidden");


    newEvent.classList.remove("hidden");







    showEvents();




};



}









// ===== ЗАКРЕПИТЬ =====



function favoriteEvent(index){



    events[index].favorite =

    !events[index].favorite;







    localStorage.setItem(

        "memoraEvents",

        JSON.stringify(events)

    );







    showEvents();



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