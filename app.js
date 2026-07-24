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


let selectedType = "idea";



// =====================
// Выбор категории
// =====================

typeButtons.forEach(function(button){


    button.onclick = function(){


        selectedType = button.getAttribute("data-type");


        typeInput.value = selectedType;



        typeButtons.forEach(function(btn){

            btn.classList.remove("active");

        });



        button.classList.add("active");



        console.log("Выбран тип:", selectedType);


    };


});





// =====================
// Сохранение
// =====================


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






// =====================
// Отрисовка карточек
// =====================


function renderMemories(){


    memoryList.innerHTML = "";



    memories.forEach(function(memory,index){



        const card = document.createElement("div");


        // ВАЖНО для цветов

        card.className = 
        "memory-card " + memory.type;



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







// =====================
// Открыть форму
// =====================


addMemory.onclick = function(){

    memoryBox.classList.remove("hidden");

};







// =====================
// Создать память
// =====================


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


        type:selectedType,


        title:title,


        text:text || "Без описания",


        date:new Date()
        .toLocaleString("ru-RU")


    };





    memories.unshift(newMemory);



    saveData();


    renderMemories();





    titleInput.value = "";

    textInput.value = "";


    memoryBox.classList.add("hidden");


};







renderMemories();