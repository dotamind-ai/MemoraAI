const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const typeButtons = document.querySelectorAll(".type-button");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");



let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];


let selectedType = "idea";





// Выбор типа

typeButtons.forEach(function(button){


    button.onclick = function(){


        selectedType = button.dataset.type;


        console.log(
            "Выбран тип:",
            selectedType
        );



        typeButtons.forEach(function(btn){

            btn.classList.remove("active");

        });



        button.classList.add("active");


    };


});







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







function renderMemories(){


    memoryList.innerHTML = "";



    memories.forEach(function(memory,index){



        const card = document.createElement("div");



        card.className =
        "memory-card " + memory.type;



        card.innerHTML = `


        <h4>

        ${getTypeName(memory.type)}
        (${memory.type})

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
    document.getElementById("memoryText")
    .value.trim();





    if(title === ""){


        alert("Введите название памяти");


        return;


    }






    memories.unshift({


        type:selectedType,


        title:title,


        text:text || "Без описания",


        date:new Date()
        .toLocaleString("ru-RU")


    });





    saveData();


    renderMemories();



    titleInput.value = "";

    document.getElementById("memoryText")
    .value = "";



    memoryBox.classList.add("hidden");


};






renderMemories();