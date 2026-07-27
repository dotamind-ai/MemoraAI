/* =====================================
        MEMORA PROFILE JS
===================================== */


console.log("MEMORA PROFILE FINAL");





// ===============================
// ELEMENTS
// ===============================


const memoraLogo =
document.getElementById("memoraLogo");


const profileMenu =
document.getElementById("profileMenu");


const profileOverlay =
document.getElementById("profileOverlay");



const editProfile =
document.getElementById("editProfile");



const loginButton =
document.getElementById("loginButton");



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









// ===============================
// PROFILE DATA
// ===============================


let userProfile = JSON.parse(

localStorage.getItem("memoraProfile")

)

||

{

name:"Гость",

avatar:"👤"

};









// ===============================
// LOAD PROFILE
// ===============================


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
// STATISTICS
// ===============================


function loadStatistics(){



let memories = JSON.parse(

localStorage.getItem("memora")

)

||

[];





let events = JSON.parse(

localStorage.getItem("memoraEvents")

)

||

[];






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
// MENU
// ===============================


function openMenu(){



if(profileMenu){

profileMenu.classList.add("show");

}



if(profileOverlay){

profileOverlay.classList.add("show");

}



}







function closeMenu(){



if(profileMenu){

profileMenu.classList.remove("show");

}



if(profileOverlay){

profileOverlay.classList.remove("show");

}



}









// LOGO BUTTON


if(memoraLogo){



memoraLogo.onclick = ()=>{


openMenu();


};


}









// CLOSE OUTSIDE


if(profileOverlay){


profileOverlay.onclick = ()=>{


closeMenu();


};


}









// ===============================
// EDIT PROFILE
// ===============================


if(editProfile){



editProfile.onclick = ()=>{


let name = prompt(

"Введите имя",

userProfile.name

);






if(name && name.trim()!==""){



userProfile.name =
name.trim();



localStorage.setItem(

"memoraProfile",

JSON.stringify(userProfile)

);



loadProfile();



}



closeMenu();



};


}









// ===============================
// LOGIN
// ===============================


if(loginButton){



loginButton.onclick = ()=>{


alert(

"Регистрация появится позже"

);



closeMenu();



};



}









// ===============================
// AVATAR
// ===============================


if(profileAvatar){



profileAvatar.onclick = ()=>{


let avatar = prompt(

"Введите символ аватара",

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
// NAVIGATION
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









// START


loadProfile();

loadStatistics();