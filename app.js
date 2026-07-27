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
// ЗАГРУЗКА ПАМЯТИ
// ===============================


let memories =
JSON.parse(
localStorage.getItem("memora")
)
||
[];








// ===============================
// СОХРАНЕНИЕ
// ===============================


function saveMemories(){


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

<div class="memory-item">


<p>

No thoughts yet...

Your ideas will appear here.

</p>


</div>

`;



return;


}









memories.forEach((memory,index)=>{



const item =
document.createElement("div");



item.className="memory-item";





item.innerHTML=`

<p>

${memory.text}

</p>



<div style="
margin-top:12px;
font-size:11px;
opacity:.45;
display:flex;
justify-content:space-between;
">


<span>

${memory.date}

</span>


<button 
class="delete-memory"
data-index="${index}"
style="
background:none;
border:none;
color:white;
opacity:.5;
cursor:pointer;
">

×


</button>


</div>


`;







item
.querySelector(".delete-memory")
.onclick=()=>{


deleteMemory(index);


};







memoryList.appendChild(item);



});



}









// ===============================
// ДОБАВЛЕНИЕ МЫСЛИ
// ===============================


if(saveMemory){


saveMemory.onclick=()=>{



const text =

memoryInput.value.trim();





if(text===""){


alert(

"Write something first"

);


return;


}







const memory={



text:text,


date:

new Date()

.toLocaleString(
"ru-RU",
{

day:"2-digit",

month:"2-digit",

hour:"2-digit",

minute:"2-digit"

}

)


};







memories.unshift(memory);





saveMemories();





memoryInput.value="";





renderMemories();





};


}









// ===============================
// УДАЛЕНИЕ
// ===============================


function deleteMemory(index){



memories.splice(

index,

1

);



saveMemories();



renderMemories();



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