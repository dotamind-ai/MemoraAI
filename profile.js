/* =====================================
        MEMORA PROFILE JS
===================================== */


console.log("MEMORA PROFILE VERSION 2");





// =========================
// ЛОГОТИП - ОТКРЫТИЕ МЕНЮ
// =========================


const profileButton = 
document.getElementById("profileMenuButton");


const profileMenu = 
document.getElementById("profileMenu");


const profileOverlay = 
document.getElementById("profileOverlay");





if(profileButton){


    profileButton.onclick = ()=>{


        profileMenu.classList.add("active");

        profileOverlay.classList.add("active");


    };


}







// закрытие окна


if(profileOverlay){


    profileOverlay.onclick = ()=>{


        profileMenu.classList.remove("active");

        profileOverlay.classList.remove("active");


    };


}








// =========================
// КНОПКИ МЕНЮ
// =========================



const menuButtons = 
document.querySelectorAll(".profile-menu button");





if(menuButtons.length){


    menuButtons[0].onclick = ()=>{


        alert("Редактирование профиля скоро будет доступно");


    };




    menuButtons[1].onclick = ()=>{


        window.location.href="settings.html";


    };




    menuButtons[2].onclick = ()=>{


        alert("Регистрация появится после запуска сервера");


    };




    menuButtons[3].onclick = ()=>{


        alert("Achievements coming soon");


    };


}









// =========================
// СТАТИСТИКА
// =========================



function loadProfileStats(){


    let memories = JSON.parse(

        localStorage.getItem("memora")

    ) || [];




    let events = JSON.parse(

        localStorage.getItem("memoraEvents")

    ) || [];





    let favorites = 0;



    memories.forEach(item=>{


        if(item.favorite){

            favorites++;

        }


    });





    events.forEach(item=>{


        if(item.favorite){

            favorites++;

        }


    });







    const memoryStat =
    document.getElementById("memoryStat");



    const eventStat =
    document.getElementById("eventStat");



    const favoriteStat =
    document.getElementById("favoriteStat");






    if(memoryStat){

        memoryStat.innerText =
        memories.length;

    }




    if(eventStat){

        eventStat.innerText =
        events.length;

    }





    if(favoriteStat){

        favoriteStat.innerText =
        favorites;

    }


}









// =========================
// ИМЯ ПОЛЬЗОВАТЕЛЯ
// =========================



function loadUserName(){


    const name =
    localStorage.getItem("memoraUser");



    const profileName =
    document.getElementById("profileName");




    if(profileName && name){


        profileName.innerText=name;


    }


}









// =========================
// НАВИГАЦИЯ
// =========================



function goHome(){


    window.location.href="app.html";


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






function goSettings(){


    window.location.href="settings.html";


}









// =========================
// ЗАПУСК
// =========================



document.addEventListener(
"DOMContentLoaded",
()=>{


    loadProfileStats();


    loadUserName();


}
);