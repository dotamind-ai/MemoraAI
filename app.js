/* =====================================
        MEMORA HOME JS V2
===================================== */


console.log("MEMORA HOME VERSION 2");




// ===============================
// ЭЛЕМЕНТЫ
// ===============================


const memoryInput =
document.getElementById("memoryInput");


const saveMemory =
document.getElementById("saveMemory");


const memoryList =
document.getElementById("memoryList");







// ===============================
// ХРАНИЛИЩЕ
// ===============================


let memories = JSON.parse(

localStorage.getItem("memora")

) || [];








// ===============================
// СОХРАНЕНИЕ
// ===============================


function saveStorage(){


localStorage.setItem(

"memora",

JSON.stringify(memories)

);


}








// ===============================
// ОТОБРАЖЕНИЕ ЛЕНТЫ
// ===============================


function renderMemories(){



if(!memoryList)
return;




memoryList.innerHTML="";





if(memories.length===0){


memoryList.innerHTML=`

<div class="empty-memory">

No memories yet

</div>

`;


return;


}








memories
.slice(0,10)
.forEach((memory,index)=>{



const card =
document.createElement("div");



card.className =
"memory-card";





card.innerHTML=`

<p>

${memory.text}

</p>



<div class="memory-footer">


<span>

${memory.date}

</span>



<button 
class="delete-memory">

×


</button>


</div>


`;







const deleteButton =
card.querySelector(".delete-memory");



deleteButton.onclick=()=>{


memories.splice(index,1);



saveStorage();


renderMemories();


};







memoryList.appendChild(card);



});





}









// ===============================
// ДОБАВЛЕНИЕ
// ===============================


if(saveMemory){



saveMemory.onclick=()=>{



const text =
memoryInput.value.trim();





if(text===""){


return;


}







const newMemory={


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







memories.unshift(newMemory);





saveStorage();



renderMemories();



memoryInput.value="";



};




}









// ===============================
// ENTER
// ===============================


if(memoryInput){


memoryInput.addEventListener(

"keydown",

function(e){


if(
e.key==="Enter"
&&
!e.shiftKey
){


e.preventDefault();


saveMemory.click();


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
// START
// ===============================


renderMemories();