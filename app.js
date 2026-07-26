/* =====================================
        MEMORA APP V5
===================================== */


// ===== ELEMENTS =====

const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");
const cancelEdit = document.getElementById("cancelEdit");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const typeButtons = document.querySelectorAll(".type-button");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");

const searchMemory = document.getElementById("searchMemory");

const filterButtons = document.querySelectorAll(".filter-button");

const sortMemory = document.getElementById("sortMemory");


// ===== DATA =====

let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];


let selectedType = "idea";

let activeFilter = "all";

let editIndex = null;



// ===== SAVE =====

function saveData(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}



// ===== TYPE NAME =====

function getTypeName(type){

    const names = {

        idea:"◇ Идея",
        goal:"◎ Цель",
        note:"▤ Заметка",
        project:"◈ Проект",
        personal:"◉ Личное"

    };


    return names[type] || "◇ Память";

}




// ===== RENDER =====

function renderMemories(){


    if(!memoryList) return;


    memoryList.innerHTML="";


    let result = [...memories];



    // FILTER

    if(activeFilter !== "all"){

        result =
        result.filter(item =>
            item.type === activeFilter
        );

    }



    // SEARCH

    if(searchMemory){

        const query =
        searchMemory.value
        .toLowerCase()
        .trim();



        if(query){

            result =
            result.filter(item =>

                item.title
                .toLowerCase()
                .includes(query)

                ||

                item.text
                .toLowerCase()
                .includes(query)

            );

        }

    }




    // SORT

    if(sortMemory){


        if(sortMemory.value==="new"){

            result.sort(
                (a,b)=>b.id-a.id
            );

        }



        if(sortMemory.value==="old"){

            result.sort(
                (a,b)=>a.id-b.id
            );

        }



        if(sortMemory.value==="favorite"){

            result.sort(
                (a,b)=>
                b.favorite-a.favorite
            );

        }


    }






    result.forEach(memory=>{


        const index =
        memories.indexOf(memory);



        const card =
        document.createElement("div");



        card.className =
        "memory-card " + memory.type;



        if(memory.favorite){

            card.classList.add("favorite");

        }




        card.innerHTML = `

        <h4>
        ${getTypeName(memory.type)}
        </h4>


        <h3>
        ${memory.title}
        </h3>


        <p>
        ${memory.text}
        </p>


        <small>
        ${memory.date}
        </small>


        <div class="memory-actions">


        <button class="edit-btn">
        ✏️
        </button>


        <button class="fav-btn">
        ${memory.favorite ? "★" : "☆"}
        </button>


        <button class="delete-btn">
        🗑
        </button>


        </div>

        `;






        // EDIT

        card.querySelector(".edit-btn")
        .onclick = ()=>{


            if(titleInput)
            titleInput.value =
            memory.title;


            if(textInput)
            textInput.value =
            memory.text;



            selectedType =
            memory.type;



            editIndex=index;



            if(saveMemory)
            saveMemory.innerText=
            "Обновить";



            if(cancelEdit)
            cancelEdit.classList.remove(
                "hidden"
            );



            if(memoryBox)
            memoryBox.classList.remove(
                "hidden"
            );


        };






        // FAVORITE

        card.querySelector(".fav-btn")
        .onclick=()=>{


            memory.favorite =
            !memory.favorite;


            saveData();

            renderMemories();


        };






        // DELETE

        card.querySelector(".delete-btn")
        .onclick=()=>{


            memories.splice(
                index,
                1
            );


            saveData();

            renderMemories();


        };





        memoryList.appendChild(card);



    });





    if(memoryCount){

        memoryCount.innerText =
        result.length +
        " воспоминаний";

    }


}







// ===== ADD BUTTON =====


if(addMemory){


addMemory.onclick=()=>{


    if(memoryBox)

    memoryBox.classList.remove(
        "hidden"
    );


};


}







// ===== TYPES =====


typeButtons.forEach(button=>{


    button.onclick=()=>{


        selectedType =
        button.dataset.type;



        typeButtons.forEach(btn=>{

            btn.classList.remove(
                "active"
            );

        });



        button.classList.add(
            "active"
        );


    };


});







// ===== FILTER =====


filterButtons.forEach(button=>{


button.onclick=()=>{


activeFilter =
button.dataset.filter;



filterButtons.forEach(btn=>{

btn.classList.remove(
"active"
);

});



button.classList.add(
"active"
);



renderMemories();


};



});







// ===== SAVE MEMORY =====


if(saveMemory){


saveMemory.onclick=()=>{


const title =
titleInput.value.trim();



const text =
textInput.value.trim();



if(!title){

alert(
"Введите название памяти"
);

return;

}





if(editIndex!==null){


memories[editIndex]={

...memories[editIndex],

title:title,

text:text || "Без описания",

type:selectedType

};


editIndex=null;



saveMemory.innerText=
"Сохранить";



}

else{


memories.unshift({

id:Date.now(),

title:title,

text:text || "Без описания",

type:selectedType,

favorite:false,

date:new Date()
.toLocaleString(
"ru-RU"
)

});


}





saveData();

renderMemories();



titleInput.value="";
textInput.value="";



if(memoryBox)

memoryBox.classList.add(
"hidden"
);



};


}







// ===== CANCEL =====


if(cancelEdit){


cancelEdit.onclick=()=>{


editIndex=null;


titleInput.value="";
textInput.value="";


saveMemory.innerText=
"Сохранить";


cancelEdit.classList.add(
"hidden"
);



memoryBox.classList.add(
"hidden"
);



};


}







// ===== SEARCH =====


if(searchMemory){


searchMemory.oninput=()=>{

renderMemories();

};


}







// ===== SORT =====


if(sortMemory){


sortMemory.onchange=()=>{

renderMemories();

};


}







// ===== NAVIGATION =====


function openPage(page){

window.location.href = page;

}



function goHome(){

openPage(
"index.html"
);

}



function goCalendar(){

openPage(
"calendar.html"
);

}



function goEvents(){

openPage(
"events.html"
);

}



function goFavorites(){

openPage(
"favorites.html"
);

}



function goProfile(){

openPage(
"profile.html"
);

}







// START

renderMemories();