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


let currentDate = new Date();





function renderCalendar() {


    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("monthTitle");


    grid.innerHTML = "";



    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();



    title.textContent =
        months[month] + " " + year;





    // первый день месяца
    // 0 = воскресенье, 1 = понедельник

    let firstDay = new Date(
        year,
        month,
        1
    ).getDay();



    // переводим в формат:
    // понедельник = 0
    // воскресенье = 6

    if (firstDay === 0) {

        firstDay = 6;

    } else {

        firstDay = firstDay - 1;

    }





    // количество дней в месяце

    const totalDays = new Date(
        year,
        month + 1,
        0
    ).getDate();






    // пустые места перед первым числом

    for (let i = 0; i < firstDay; i++) {


        const empty = document.createElement("div");

        empty.className = "calendar-empty";

        grid.appendChild(empty);

    }







    // создаём дни

    for (let day = 1; day <= totalDays; day++) {


        const cell = document.createElement("div");


        cell.className = "calendar-day";


        cell.textContent = day;






        const today = new Date();



        if (

            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()

        ) {

            cell.classList.add("today");

        }






        grid.appendChild(cell);


    }


}








document.addEventListener(
"DOMContentLoaded",
function(){


    renderCalendar();



    document
    .getElementById("prevMonth")
    .addEventListener(
    "click",
    function(){


        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        renderCalendar();


    });



    document
    .getElementById("nextMonth")
    .addEventListener(
    "click",
    function(){


        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        renderCalendar();


    });



});
