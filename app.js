const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


// Загружаем память

let memories = [];

const saved = localStorage.getItem("memora");

if (saved) {
    memories = JSON.parse(saved);
}


// Показываем карточки

function renderMemories() {

    memoryList.innerHTML = "";


    memories.forEach((memory, index) => {


        const card = document.createElement("div");


        card.innerHTML = `

        <h4>💡 ${memory.title}</h4>

        <p>${memory.text}</p>

        <small>${memory.date}</small>

        <br><br>

        <button onclick="deleteMemory(${index})">
        Удалить
        </button>

        `;


        memoryList.appendChild(card);


    });


    memoryCount.innerText =
    memories.length + " воспоминаний";

}



// Удаление

function deleteMemory(index){

    memories.splice(index,1);

    saveMemories();

    renderMemories();

}



// Сохранение

function saveMemories(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}



// Открываем форму

addMemory.onclick = function(){

    memoryBox.classList.remove("hidden");

};




// Создаем память

saveMemory.onclick = function(){


    let title = titleInput.value.trim();

    let text = textInput.value.trim();



    if(title === ""){

        alert("Напиши название");

        return;

    }



    let memory = {

        title: title,

        text: text || "Без описания",

        date: new Date()
        .toLocaleDateString("ru-RU")

    };



    memories.unshift(memory);



    saveMemories();


    renderMemories();



    titleInput.value = "";

    textInput.value = "";


    memoryBox.classList.add("hidden");


    alert("Воспоминание сохранено");

};



// Запуск

renderMemories();