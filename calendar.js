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
        console.log("Нет элементов календаря");
        return;
    }



    grid.innerHTML = "";

    title.innerHTML = months[currentMonth] + " " + currentYear;



    const week = [
        "Пн",
        "Вт",
        "Ср",
        "Чт",
        "Пт",
        "Сб",
        "Вс"
    ];



    week.forEach(day=>{


        const name = document.createElement("div");

        name.className = "day-name";

        name.innerHTML = day;

        grid.appendChild(name);


    });





    let firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();



    if(firstDay === 0){

        firstDay = 7;

    }




    let days = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();





    for(let i = 1; i < firstDay; i++){


        let empty = document.createElement("div");

        grid.appendChild(empty);


    }





    for(let day = 1; day <= days; day++){


        let cell = document.createElement("div");


        cell.className = "calendar-day";


        cell.innerHTML = day;




        cell.onclick = function(){

            openMemory(day);

        };




        let today = new Date();



        if(

            day === today.getDate() &&

            currentMonth === today.getMonth() &&

            currentYear === today.getFullYear()

        ){

            cell.classList.add("today");

        }



        grid.appendChild(cell);


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


    const modal = document.getElementById("memoryModal");

    const date = document.getElementById("memoryDate");



    if(!modal || !date){

        return;

    }




    date.innerHTML =
    day + " " + months[currentMonth];



    modal.classList.add("show");


}






function closeMemory(){


    const modal = document.getElementById("memoryModal");


    if(modal){

        modal.classList.remove("show");

    }


}






function saveMemory(){


    const text = document.getElementById("memoryText");



    if(!text.value.trim()){

        return;

    }



    text.value = "";

    closeMemory();


}







window.onload = function(){


    renderCalendar();


};