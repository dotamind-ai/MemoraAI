const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");
const typeInput = document.getElementById("memoryType");

const typeButtons = document.querySelectorAll(".type-button");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");



let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];





// выбор категории

typeButtons.forEach(function(button){


    button.onclick = function(){


        typeButtons.forEach(function(btn){

            btn.classList.remove("active");

        });



        button.classList.add("active");



        typeInput.value =
        button.dataset.type;


    };


});






function saveData(){


    localStorage.setItem(

        "memora",

        JSON.stringify(memories)

    );


}






function getTypeName(type){


    const types = {


        idea:"◇ Идея",

        goal:"◎ Цель",

        note:"▤ Заметка",

        project:"◈ Проект",

        personal:"◉ Личное"


    };


    return types[type] || "◇ Память";


}







function renderMemories(){


    memoryList.innerHTML = "";



    memories.forEach(function(memory,index){



        const card = document.createElement("div");



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



        <button class="deleteButton">

        Удалить

        </button>


        `;



        card
        .querySelector(".deleteButton")
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






    const newMemory = {


        type:

        typeInput.value,



        title:title,



        text:

        text || "Без описания",



        date:

        new Date()

        .toLocaleString("ru-RU")



    };





    memories.unshift(newMemory);



    saveData();



    renderMemories();





    titleInput.value="";


    textInput.value="";



    memoryBox.classList.add("hidden");



};








renderMemories();