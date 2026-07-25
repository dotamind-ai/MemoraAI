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


let date = new Date();





function drawCalendar(){


    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("monthTitle");


    if(!grid || !title){
        return;
    }



    grid.innerHTML = "";



    let month = date.getMonth();

    let year = date.getFullYear();




    title.textContent =
    months[month] + " " + year;





    let firstDay =
    new Date(year, month, 1).getDay();



    if(firstDay === 0){

        firstDay = 7;

    }






    for(let i = 1; i < firstDay; i++){


        let empty =
        document.createElement("div");


        empty.className =
        "calendar-empty";


        grid.appendChild(empty);


    }






    let days =
    new Date(year, month + 1, 0).getDate();





    for(let i = 1; i <= days; i++){


        let day =
        document.createElement("div");



        day.className =
        "calendar-day";



        day.textContent = i;





        let now = new Date();




        if(

            i === now.getDate()
            &&
            month === now.getMonth()
            &&
            year === now.getFullYear()

        ){

            day.classList.add("today");

        }




        grid.appendChild(day);



    }


}








// Стрелки календаря


const prevMonth =
document.getElementById("prevMonth");



const nextMonth =
document.getElementById("nextMonth");





if(prevMonth){

prevMonth.onclick = ()=>{


    date.setMonth(
        date.getMonth() - 1
    );


    drawCalendar();


};

}






if(nextMonth){

nextMonth.onclick = ()=>{


    date.setMonth(
        date.getMonth() + 1
    );


    drawCalendar();


};

}









// ===== НАВИГАЦИЯ =====


window.addEventListener("DOMContentLoaded",()=>{



const homeScreen =
document.getElementById("homeScreen");



const calendarScreen =
document.getElementById("calendarScreen");



const navItems =
document.querySelectorAll(".nav-item");





if(
!homeScreen ||
!calendarScreen ||
navItems.length < 2
){

console.log("Навигация не найдена");

return;

}






function setActive(button){


navItems.forEach(item=>{

item.classList.remove("active");

});


button.classList.add("active");


}







// Главная


navItems[0].onclick = ()=>{


calendarScreen.classList.add("hidden");


homeScreen.classList.remove("hidden");


setActive(navItems[0]);


};







// Календарь


navItems[1].onclick = ()=>{


homeScreen.classList.add("hidden");


calendarScreen.classList.remove("hidden");


setActive(navItems[1]);


};





});








drawCalendar();