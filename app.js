const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");
const typeInput = document.getElementById("memoryType");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];



function saveData(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}




function getTypeName(type){

    if(type === "idea"){
        return "◇ Идея";
    }

    if(type === "goal"){
        return "◎ Цель";
    }

    if(type === "note"){
        return "▤ Заметка";
    }

    if(type === "project"){
        return "◈ Проект";
    }

    if(type === "personal"){
        return "◉ Личное";
    }

    return "◇ Память";

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


    const memory = {


        type: typeInput.value,


        title: titleInput.value.trim(),


        text: textInput.value.trim(),


        date: new Date()
        .toLocaleString("ru-RU")


    };



    if(memory.title === ""){

        alert("Введите название памяти");

        return;

    }



    memories.unshift(memory);


    saveData();


    renderMemories();


    titleInput.value = "";

    textInput.value = "";


    memoryBox.classList.add("hidden");


};






renderMemories();