const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const typeButtons = document.querySelectorAll(".type-button");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


alert("MEMORA новый код загружен");



let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];


let selectedType = "idea";





typeButtons.forEach(function(button){


    button.onclick = function(){


        selectedType = this.dataset.type;



        typeButtons.forEach(function(btn){

            btn.classList.remove("active");

        });



        this.classList.add("active");


    };


});






function saveData(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}







function typeName(type){


    const names = {

        idea:"◇ Идея",
        goal:"◎ Цель",
        note:"▤ Заметка",
        project:"◈ Проект",
        personal:"◉ Личное"

    };


    return names[type] || "◇ Память";

}







function renderMemories(){


    memoryList.innerHTML = "";



    memories.sort(function(a,b){

        return (b.favorite ? 1 : 0) -
               (a.favorite ? 1 : 0);

    });





    memories.forEach(function(memory,index){


        const card = document.createElement("div");


        card.className =
        "memory-card " + memory.type;



        if(memory.favorite){

            card.classList.add("favorite");

        }





        card.innerHTML = `


        <h4>
        ${typeName(memory.type)}
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



        <button class="favoriteButton">

        ${memory.favorite ? "★ Закреплено" : "☆ Закрепить"}

        </button>



        <button class="deleteButton">

        Удалить

        </button>


        `;





        card.querySelector(".favoriteButton")
        .onclick = function(){


            memory.favorite =
            !memory.favorite;


            saveData();

            renderMemories();


        };






        card.querySelector(".deleteButton")
        .onclick = function(){


            memories.splice(index,1);


            saveData();

            renderMemories();


        };




        memoryList.appendChild(card);


    });



    memoryCount.innerText =
    memories.length + " воспоминаний";


}







addMemory.onclick = function(){

    memoryBox.classList.remove("hidden");

};







saveMemory.onclick = function(){


    const title =
    titleInput.value.trim();


    const text =
    textInput.value.trim();




    if(title === ""){


        alert("Введите название памяти");


        return;

    }





    memories.unshift({

        type:selectedType,

        title:title,

        text:text || "Без описания",

        favorite:false,

        date:new Date()
        .toLocaleString("ru-RU")

    });





    saveData();


    renderMemories();



    titleInput.value="";

    textInput.value="";


    memoryBox.classList.add("hidden");


};






renderMemories();