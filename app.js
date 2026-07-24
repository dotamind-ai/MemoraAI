/* =====================================
        MEMORA V2 APP FULL
===================================== */


const addMemory = document.getElementById("addMemory");

const memoryBox = document.getElementById("memoryBox");

const saveMemory = document.getElementById("saveMemory");

const cancelEdit = document.getElementById("cancelEdit");


const titleInput = document.getElementById("memoryTitle");

const textInput = document.getElementById("memoryText");

const typeInput = document.getElementById("memoryType");


const typeButtons = document.querySelectorAll(".type-button");


const memoryList = document.getElementById("memoryList");

const memoryCount = document.getElementById("memoryCount");

const searchMemory = document.getElementById("searchMemory");




let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];



let selectedType = "idea";


let editIndex = null;






/* =========================
        TYPES
========================= */


typeButtons.forEach(button => {


    button.onclick = ()=>{


        selectedType = button.dataset.type;


        typeInput.value = selectedType;



        typeButtons.forEach(btn=>{

            btn.classList.remove("active");

        });



        button.classList.add("active");


    };


});







/* =========================
        STORAGE
========================= */


function saveData(){


    localStorage.setItem(

        "memora",

        JSON.stringify(memories)

    );


}







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







/* =========================
        RENDER
========================= */


function renderMemories(){


    memoryList.innerHTML="";



    let result = memories;



    if(searchMemory && searchMemory.value.trim() !== ""){


        let query =

        searchMemory.value.toLowerCase();



        result = memories.filter(memory=>{


            return (

                memory.title
                .toLowerCase()
                .includes(query)


                ||


                memory.text
                .toLowerCase()
                .includes(query)


            );


        });


    }






    result.sort((a,b)=>{


        return b.favorite - a.favorite;


    });







    result.forEach((memory)=>{



        const index = memories.indexOf(memory);



        const card = document.createElement("div");



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


        <br><br>



        <button class="editButton">

        ✏️ Изменить

        </button>



        <button class="favoriteButton">

        ${memory.favorite 
        ? "★ Закреплено"
        : "☆ Закрепить"}

        </button>



        <button class="deleteButton">

        Удалить

        </button>



        `;








        card.querySelector(".editButton")
        .onclick = ()=>{


            titleInput.value = memory.title;


            textInput.value = memory.text;



            selectedType = memory.type;


            typeButtons.forEach(btn=>{


                btn.classList.remove("active");



                if(btn.dataset.type === memory.type){


                    btn.classList.add("active");


                }


            });



            editIndex = index;



            saveMemory.innerText =
            "Обновить";



            cancelEdit.classList.remove("hidden");



            memoryBox.classList.remove("hidden");


        };







        card.querySelector(".favoriteButton")
        .onclick = ()=>{


            memory.favorite =

            !memory.favorite;



            saveData();


            renderMemories();


        };








        card.querySelector(".deleteButton")
        .onclick = ()=>{


            memories.splice(index,1);


            saveData();


            renderMemories();


        };







        memoryList.appendChild(card);


    });






    memoryCount.innerText =


    result.length +

    " воспоминаний";



}







/* =========================
        OPEN
========================= */


addMemory.onclick = ()=>{


    memoryBox.classList.remove("hidden");


};







/* =========================
        SAVE / EDIT
========================= */


saveMemory.onclick = ()=>{


    const title =

    titleInput.value.trim();



    const text =

    textInput.value.trim();






    if(title===""){


        alert(
        "Введите название памяти"
        );


        return;

    }







    if(editIndex !== null){



        memories[editIndex].title = title;


        memories[editIndex].text =

        text || "Без описания";



        memories[editIndex].type = selectedType;



        editIndex = null;



        saveMemory.innerText =
        "Сохранить";



        cancelEdit.classList.add("hidden");



    }

    else{



        memories.unshift({


            id:Date.now(),


            type:selectedType,


            title:title,


            text:
            text || "Без описания",



            date:
            new Date()
            .toLocaleString("ru-RU"),



            favorite:false



        });



    }







    saveData();


    renderMemories();




    titleInput.value="";


    textInput.value="";



    memoryBox.classList.add("hidden");



};








/* =========================
        CANCEL EDIT
========================= */


if(cancelEdit){


cancelEdit.onclick = ()=>{


    editIndex=null;


    titleInput.value="";


    textInput.value="";



    saveMemory.innerText =
    "Сохранить";



    cancelEdit.classList.add("hidden");



    memoryBox.classList.add("hidden");



};


}








/* =========================
        SEARCH
========================= */


if(searchMemory){


searchMemory.addEventListener(

"input",

()=>{


    renderMemories();


}

);


}







/* START */


renderMemories();