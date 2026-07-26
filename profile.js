/* =====================================
        MEMORA PROFILE JS
===================================== */


console.log("MEMORA PROFILE READY");




// ===============================
// ЭЛЕМЕНТЫ
// ===============================


const logoButton = 
document.getElementById("profileMenuButton");


const menu = 
document.getElementById("profileMenu");


const overlay = 
document.getElementById("profileOverlay");






// ===============================
// ОТКРЫТИЕ МЕНЮ
// ===============================


if(logoButton){


    logoButton.addEventListener(
        "click",
        ()=>{


            menu.classList.add("active");


            overlay.classList.add("active");


        }
    );


}







// ===============================
// ЗАКРЫТИЕ МЕНЮ
// ===============================


if(overlay){


    overlay.addEventListener(
        "click",
        ()=>{


            menu.classList.remove("active");


            overlay.classList.remove("active");


        }
    );


}









// ===============================
// КНОПКИ МЕНЮ
// ===============================



const editProfile =
document.getElementById("editProfile");



const loginButton =
document.getElementById("loginButton");






if(editProfile){


    editProfile.onclick = ()=>{


        alert(
        "Edit Profile will be available soon"
        );


    };


}






if(loginButton){


    loginButton.onclick = ()=>{


        alert(
        "Login system will start after server launch"
        );


    };


}









// ===============================
// СТАТИСТИКА
// ===============================



function updateStats(){



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







    const memory =
    document.getElementById("memoryStat");



    const event =
    document.getElementById("eventStat");



    const favorite =
    document.getElementById("favoriteStat");







    if(memory){

        memory.innerText =
        memories.length;

    }




    if(event){

        event.innerText =
        events.length;

    }





    if(favorite){

        favorite.innerText =
        favorites;

    }



}









// ===============================
// ИМЯ ПОЛЬЗОВАТЕЛЯ
// ===============================



function loadName(){



    const name =
    localStorage.getItem("memoraUser");



    const profileName =
    document.getElementById("profileName");





    if(name && profileName){


        profileName.innerText = name;


    }



}









// ===============================
// НАВИГАЦИЯ
// ===============================



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









// ===============================
// ЗАПУСК
// ===============================



document.addEventListener(
"DOMContentLoaded",
()=>{


    updateStats();


    loadName();


}

);