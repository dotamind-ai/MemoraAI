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



function renderMemories(){


    memoryList.innerHTML = "";


    memories.forEach(memory => {


        const card = document.createElement("div");


        card.innerHTML = `

        <h4>${memory.title}</h4>

        <p>${memory.text}</p>

        `;


        memoryList.appendChild(card);


    });


    memoryCount.innerText =
    memories.length +
    " воспоминаний";


}



addMemory.onclick = function(){


    memoryBox.classList.remove("hidden");


};



saveMemory.onclick = function(){


    let title =
    titleInput.value.trim();


    let text =
    textInput.value.trim();



    if(title && text){


        memories.push({

            title:title,

            text:text,

            date:new Date()
            .toLocaleDateString()

        });



        localStorage.setItem(

            "memora",

            JSON.stringify(memories)

        );



        titleInput.value="";

        textInput.value="";



        memoryBox.classList.add("hidden");



        renderMemories();


    }


};



renderMemories();