const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


// Загружаем сохранённые записи

let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];



// Показываем записи

function renderMemories() {


    memoryList.innerHTML = "";


    memories.forEach(function(memory, index) {


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


        <br>


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



// Сохраняем данные

function saveData(){


    localStorage.setItem(

        "memora",

        JSON.stringify(memories)

    );


}



// Открыть форму

addMemory.onclick = function(){


    memoryBox.classList.remove("hidden");


};




// Сохранить память

saveMemory.onclick = function(){


    const title =
    titleInput.value.trim();


    const text =
    textInput.value.trim();



    if(title === "" || text === ""){


        alert("Заполни оба поля");


        return;


    }



    const memory = {


        title:title,


        text:text,


        date:
        new Date()
        .toLocaleDateString("ru-RU")


    };



    memories.unshift(memory);



    saveData();


    renderMemories();



    titleInput.value = "";

    textInput.value = "";


    memoryBox.classList.add("hidden");


    alert("Воспоминание сохранено");


};



// Первый запуск

renderMemories();