console.log("MEMORA PROFILE");


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




// статистика


let memories = JSON.parse(

localStorage.getItem("memora")

) || [];



let events = JSON.parse(

localStorage.getItem("memoraEvents")

) || [];




let favorites = memories.filter(

item => item.favorite

).length;



document.getElementById("memoryStat").innerText =
memories.length;



document.getElementById("eventStat").innerText =
events.length;



document.getElementById("favoriteStat").innerText =
favorites;