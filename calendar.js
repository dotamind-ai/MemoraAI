let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();



const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];



function renderCalendar(){


    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("monthTitle");


    if(!grid || !title){
        return;
    }


    title.innerHTML = months[currentMonth] + " " + currentYear;


    grid.innerHTML = "";



    const weekDays = [
        "Пн",
        "Вт",
        "Ср",
        "Чт",
        "Пт",
        "Сб",
        "Вс"
    ];



    weekDays.forEach(day => {


        let item = document.createElement("div");

        item.className = "day-name";

        item.innerHTML = day;

        grid.appendChild(item);


    });




    let firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();



    if(firstDay === 0){

        firstDay = 7;

    }



    let totalDays = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();




    for(let i = 1; i < firstDay; i++){


        let empty = document.createElement("div");

        grid.appendChild(empty);


    }





    for(let day = 1; day <= totalDays; day++){


        let item = document.createElement("div");


        item.className = "calendar-day";


        item.innerHTML = day;



        item.onclick = function(){


            openMemory(day);


        };





        let today = new Date();



        if(
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ){

            item.classList.add("today");

        }




        grid.appendChild(item);


    }


}




function changeMonth(value){


    currentMonth += value;



    if(currentMonth < 0){

        currentMonth = 11;

        currentYear--;

    }



    if(currentMonth > 11){

        currentMonth = 0;

        currentYear++;

    }



    renderCalendar();


}







function openMemory(day){


    let modal = document.getElementById("memoryModal");

    let title = document.getElementById("memoryDate");



    if(!modal || !title){

        return;

    }



    title.innerHTML =
    day + " " + months[currentMonth];



    modal.classList.add("show");


}






function closeMemory(){


    let modal = document.getElementById("memoryModal");


    if(modal){

        modal.classList.remove("show");

    }


}






function saveMemory(){


    let text = document.getElementById("memoryText").value;



    if(text.trim() === ""){

        return;

    }



    closeMemory();


}






document.addEventListener(
"DOMContentLoaded",
()=>{

    renderCalendar();

}
);