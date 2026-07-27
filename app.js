/* =====================================
        MEMORA HOME JS V1
===================================== */


console.log("MEMORA HOME VERSION 1");



// ===============================
// ЭЛЕМЕНТЫ
// ===============================


const thoughtInput =
document.getElementById("quickThought");


const saveButton =
document.getElementById("saveThought");


const thoughtFeed =
document.getElementById("thoughtFeed");


const thoughtCount =
document.getElementById("thoughtCount");




// ===============================
// ДАННЫЕ
// ===============================


let thoughts = JSON.parse(

localStorage.getItem("memoraThoughts")

) || [];





// ===============================
// СОХРАНЕНИЕ
// ===============================


function saveStorage(){


localStorage.setItem(

"memoraThoughts",

JSON.stringify(thoughts)

);


}






// ===============================
// ОТОБРАЖЕНИЕ ЛЕНТЫ
// ===============================


function renderThoughts(){


if(!thoughtFeed)
return;



thoughtFeed.innerHTML="";





if(thoughts.length===0){


thoughtFeed.innerHTML=`

<div class="empty-state">

No thoughts yet

</div>

`;


}







thoughts.slice(0,10).forEach((item,index)=>{



const card =
document.createElement("div");



card.className =
"thought-card";





card.innerHTML = `


<div class="thought-content">


<p>

${item.text}

</p>


<small>

${item.date}

</small>


</div>



<button 
class="delete-thought"
data-index="${index}">


×


</button>


`;






const deleteBtn =
card.querySelector(".delete-thought");



deleteBtn.onclick=()=>{


thoughts.splice(index,1);


saveStorage();


renderThoughts();


};






thoughtFeed.appendChild(card);



});





updateCount();


}









// ===============================
// СЧЁТЧИК
// ===============================


function updateCount(){


if(thoughtCount){


thoughtCount.innerText =
thoughts.length;


}


}









// ===============================
// ДОБАВЛЕНИЕ МЫСЛИ
// ===============================


if(saveButton){



saveButton.onclick=()=>{



const text =
thoughtInput.value.trim();





if(text===""){


return;


}







const newThought = {


text:text,


date:
new Date()
.toLocaleDateString(
"ru-RU",
{

day:"numeric",

month:"short"

}

)


};







thoughts.unshift(newThought);





saveStorage();



renderThoughts();



thoughtInput.value="";



};




}









// ===============================
// ENTER ДЛЯ СОХРАНЕНИЯ
// ===============================


if(thoughtInput){



thoughtInput.addEventListener(

"keydown",

(e)=>{


if(

e.key==="Enter"
&&
!e.shiftKey

){


e.preventDefault();


saveButton.click();


}


}


);


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









// ===============================
// ЗАПУСК
// ===============================


renderThoughts();