/* =====================================
        MEMORA PROFILE JS
===================================== */


console.log("MEMORA PROFILE READY");




// ===============================
// ЭЛЕМЕНТЫ
// ===============================


const logoButton = document.getElementById(
    "profileMenuButton"
);


const profileMenu = document.getElementById(
    "profileMenu"
);


const overlay = document.getElementById(
    "profileOverlay"
);






// ===============================
// ОТКРЫТИЕ МЕНЮ
// ===============================


if(logoButton){


    logoButton.addEventListener(
        "click",
        ()=>{


            profileMenu.classList.add(
                "active"
            );


            overlay.classList.add(
                "active"
            );


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


            profileMenu.classList.remove(
                "active"
            );


            overlay.classList.remove(
                "active"
            );


        }
    );


}









// ===============================
// КНОПКИ МЕНЮ
// ===============================


const editProfile =
document.getElementById(
    "editProfile"
);



const loginButton =
document.getElementById(
    "loginButton"
);






if(editProfile){


    editProfile.onclick = ()=>{


        alert(
            "Edit Profile coming soon"
        );


    };


}







if(loginButton){


    loginButton.onclick = ()=>{


        alert(
            "Registration will be added after server launch"
        );


    };


}









// ===============================
// СТАТИСТИКА
// ===============================


function updateProfileStats(){



    let memories =
    JSON.parse(
        localStorage.getItem("memora")
    ) || [];




    let events =
    JSON.parse(
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
    document.getElementById(
        "memoryStat"
    );



    const eventStat =
    document.getElementById(
        "eventStat"
    );



    const favoriteStat =
    document.getElementById(
        "favoriteStat"
    );









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
// ИМЯ ПОЛЬЗОВАТЕЛЯ
// ===============================


function loadProfileName(){



    const savedName =
    localStorage.getItem(
        "memoraUser"
    );



    const name =
    document.getElementById(
        "profileName"
    );





    if(savedName && name){


        name.innerText =
        savedName;


    }



}









// ===============================
// БУДУЩИЙ АВАТАР
// ===============================


const avatar =
document.getElementById(
    "profileAvatar"
);



if(avatar){


    avatar.onclick = ()=>{


        alert(
            "Avatar upload will be added with registration"
        );


    };


}









// ===============================
// НАВИГАЦИЯ
// ===============================


function goHome(){


    window.location.href =
    "app.html";


}





function goCalendar(){


    window.location.href =
    "calendar.html";


}





function goEvents(){


    window.location.href =
    "events.html";


}





function goProfile(){


    window.location.href =
    "profile.html";


}





function goSettings(){


    window.location.href =
    "settings.html";


}









// ===============================
// ЗАПУСК
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


    updateProfileStats();


    loadProfileName();


});