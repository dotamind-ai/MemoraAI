/* =====================================
        MEMORA PROFILE JS
===================================== */


console.log("MEMORA PROFILE VERSION 2");





// ===============================
// ЭЛЕМЕНТЫ
// ===============================


const profileName =
document.getElementById("profileName");


const profileAvatar =
document.getElementById("profileAvatar");



const memoryStat =
document.getElementById("memoryStat");


const eventStat =
document.getElementById("eventStat");


const favoriteStat =
document.getElementById("favoriteStat");





const profileMenuButton =
document.getElementById("profileMenuButton");



const profileMenu =
document.getElementById("profileMenu");



const profileOverlay =
document.getElementById("profileOverlay");





const editProfile =
document.getElementById("editProfile");





const loginButton =
document.getElementById("loginButton");









// ===============================
// ЗАГРУЗКА ПРОФИЛЯ
// ===============================


let userProfile = JSON.parse(

localStorage.getItem("memoraProfile")

) || {


name:"Гость",


avatar:"👤"


};









function loadProfile(){



if(profileName){


profileName.innerText =
userProfile.name;


}



if(profileAvatar){


profileAvatar.innerText =
userProfile.avatar;


}



}









// ===============================
// СТАТИСТИКА
// ===============================


function loadStatistics(){



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
// ОТКРЫТИЕ МЕНЮ
// ===============================


function openProfileMenu(){



if(profileMenu){

profileMenu.classList.add("show");

}



if(profileOverlay){

profileOverlay.classList.add("show");

}



}








function closeProfileMenu(){



if(profileMenu){

profileMenu.classList.remove("show");

}



if(profileOverlay){

profileOverlay.classList.remove("show");

}


}









if(profileMenuButton){


profileMenuButton.onclick = ()=>{


openProfileMenu();


};


}








if(profileOverlay){


profileOverlay.onclick = ()=>{


closeProfileMenu();


};


}









// ===============================
// ИЗМЕНИТЬ ПРОФИЛЬ
// ===============================


if(editProfile){


editProfile.onclick = ()=>{



let newName = prompt(

"Введите имя",

userProfile.name

);





if(newName && newName.trim()!==""){



userProfile.name =
newName.trim();




localStorage.setItem(

"memoraProfile",

JSON.stringify(userProfile)

);




loadProfile();



}



closeProfileMenu();



};



}









// ===============================
// ВХОД / РЕГИСТРАЦИЯ
// ===============================


if(loginButton){


loginButton.onclick = ()=>{



alert(

"Регистрация будет доступна после запуска сервера"

);



closeProfileMenu();



};


}









// ===============================
// СМЕНА АВАТАРА
// ===============================


if(profileAvatar){


profileAvatar.onclick = ()=>{



let avatar = prompt(

"Введите эмодзи аватара",

userProfile.avatar

);





if(avatar){



userProfile.avatar =
avatar;



localStorage.setItem(

"memoraProfile",

JSON.stringify(userProfile)

);



loadProfile();


}



};


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





function goSettings(){


window.location.href="settings.html";


}









// ===============================
// START
// ===============================


loadProfile();


loadStatistics();