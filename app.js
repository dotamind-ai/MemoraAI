const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];



function renderMemories() {

    memoryList.innerHTML = "";


    memories.forEach((memory, index) => {


        const card = document.createElement("div");


        card.innerHTML = `

        <h4>
        💡 ${memory.title}
        </h4>

        <p>
        ${memory.text}
        </p>

        <small>
        ${memory.date}
        </small>

        <button class="delete">
        Удалить
        </button>

        `;


        card.querySelector(".delete")
        .onclick = function(){


            memories.splice(index,1);


            saveMemories();


            renderMemories();


        };


        memoryList.appendChild(card);


    });


    memoryCount.innerText =
    memories.length +
    " воспоминаний";


}




function saveMemories(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}




addMemory.onclick = function(){

    memoryBox.classList.remove("hidden");

};





saveMemory.onclick = function(){


    const title =
    titleInput.value.trim();


    const text =
    textInput.value.trim();



    if(title === "" || text === ""){

        alert("Заполни оба поля");

        return;

    }



    memories.unshift({

        title:title,

        text:text,

        date:
        new Date()
        .toLocaleDateString("ru-RU")

    });



    saveMemories();



    titleInput.value="";

    textInput.value="";


    memoryBox.classList.add("hidden");


    renderMemories();


};





renderMemories();