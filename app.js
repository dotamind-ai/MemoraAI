/* =================================
        MEMORA APP JS V3
================================= */


console.log("MEMORA HOME VERSION 3");



const memoryInput =
document.getElementById("memoryInput");


const saveMemory =
document.getElementById("saveMemory");


const memoryList =
document.getElementById("memoryList");


const memoryCount =
document.getElementById("memoryCount");



const typeButtons =
document.querySelectorAll(".type-btn");




let selectedType = "idea";





let memories = JSON.parse(

localStorage.getItem("memora")

) || [];









/* =================================
        TYPE SELECT
================================= */


typeButtons.forEach(button=>{


    button.onclick=()=>{


        typeButtons.forEach(btn=>{

            btn.classList.remove("active");

        });



        button.classList.add("active");



        selectedType =
        button.dataset.type;



    };


});









/* =================================
        RENDER
================================= */


function renderMemories(){



    if(!memoryList) return;



    memoryList.innerHTML="";




    memories.forEach((memory,index)=>{



        const card =
        document.createElement("div");



        card.className =
        "memory-item";




        card.innerHTML = `


        <div class="memory-type">

        ${memory.type}

        </div>



        <div class="memory-text">

        ${memory.text}

        </div>



        <div class="memory-footer">


        <span>

        ${memory.date}

        </span>



        <button 
        class="delete-memory">

        Delete

        </button>



        </div>



        `;




        card
        .querySelector(".delete-memory")
        .onclick=()=>{


            memories.splice(index,1);


            saveStorage();


            renderMemories();


        };





        memoryList.appendChild(card);



    });




    if(memoryCount){

        memoryCount.innerText =
        memories.length;

    }



}









/* =================================
        SAVE
================================= */


if(saveMemory){



saveMemory.onclick=()=>{


    const text =
    memoryInput.value.trim();





    if(text===""){


        return;


    }





    const memory={


        text:text,


        type:selectedType.toUpperCase(),



        date:new Date()

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



    saveStorage();



    memoryInput.value="";



    renderMemories();



};



}









function saveStorage(){


    localStorage.setItem(

        "memora",

        JSON.stringify(memories)

    );


}









/* =================================
        NAVIGATION
================================= */


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









/* =================================
        START
================================= */


renderMemories();