const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");



let memories = [];

try {

    memories = JSON.parse(
        localStorage.getItem("memora")
    ) || [];

} catch {

    memories = [];

}




function saveData(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}




function renderMemories(){


    memoryList.innerHTML = "";


    memories.forEach(function(item,index){


        const card = document.createElement("div");


        card.innerHTML = `

        <h4>
        💡 ${item.title}
        </h4>


        <p>
        ${item.text}
        </p>


        <small>
        🕒 ${item.date}
        </small>


        <button class="deleteButton">
        Удалить
        </button>

        `;



        const deleteButton =
        card.querySelector(".deleteButton");



        deleteButton.onclick = function(){


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



    titleInput.value = "";

    textInput.value = "";


    memoryBox.classList.add("hidden");


};





renderMemories();