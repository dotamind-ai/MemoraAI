console.log("MEMORA PROFILE");



const openMenu =
document.getElementById("openProfileMenu");


const modal =
document.getElementById("profileModal");


const closeMenu =
document.getElementById("closeProfileMenu");





if(openMenu){


openMenu.onclick = ()=>{


modal.classList.remove("hidden");


};


}







if(closeMenu){


closeMenu.onclick = ()=>{


modal.classList.add("hidden");


};


}







if(modal){


modal.onclick = (e)=>{


if(e.target === modal){


modal.classList.add("hidden");


}


};


}








function updateStats(){


let memories =
JSON.parse(localStorage.getItem("memora"))
|| [];



let events =
JSON.parse(localStorage.getItem("memoraEvents"))
|| [];




let favorites =
memories.filter(
item=>item.favorite
).length
+
events.filter(
item=>item.favorite
).length;





if(document.getElementById("memoryStat"))

document.getElementById("memoryStat").innerText =
memories.length;





if(document.getElementById("eventStat"))

document.getElementById("eventStat").innerText =
events.length;





if(document.getElementById("favoriteStat"))

document.getElementById("favoriteStat").innerText =
favorites;



}





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





updateStats();