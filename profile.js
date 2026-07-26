/* =====================================
        MEMORA PROFILE JS
===================================== */


console.log("MEMORA PROFILE READY");




// ===============================
// Элементы
// ===============================


const profileName =
document.getElementById("profileName");


const memoryStat =
document.getElementById("memoryStat");


const eventStat =
document.getElementById("eventStat");


const favoriteStat =
document.getElementById("favoriteStat");


const editProfile =
document.getElementById("editProfile");


const loginButton =
document.getElementById("loginButton");








// ===============================
// Загрузка статистики
// ===============================


function loadProfileStats(){



    // Память из app.js

    let memories = JSON.parse(

        localStorage.getItem("memora")

    ) || [];




    // События из events.js

    let events = JSON.parse(

        localStorage.getItem("memoraEvents")

    ) || [];






    let favorites = 0;




    events.forEach(event=>{


        if(event.favorite){

            favorites++;

        }


    });






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









// ===============================
// Имя пользователя
// ===============================


function loadUser(){


    let user =

    localStorage.getItem("memoraUser");



    if(user && profileName){


        profileName.innerText = user;


    }


}









// ===============================
// Изменение профиля
// ===============================


if(editProfile){


editProfile.onclick = ()=>{


    let name = prompt(

        "Введите имя:",

        profileName.innerText

    );





    if(name && name.trim() !== ""){


        localStorage.setItem(

            "memoraUser",

            name.trim()

        );



        profileName.innerText =

        name.trim();



    }



};


}









// ===============================
// Регистрация (пока заглушка)
// ===============================


if(loginButton){


loginButton.onclick = ()=>{


alert(

"Регистрация будет подключена после запуска сервера"

);



};


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





function goSettings(){


window.location.href="profile.html";


}








// ===============================
// Старт
// ===============================


loadProfileStats();


loadUser();