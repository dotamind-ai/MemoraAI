const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


let memories = [];


addMemory.onclick = function() {

    memoryBox.classList.remove("hidden");

};



saveMemory.onclick = function() {


    let title = titleInput.value;

    let text = textInput.value;


    if(title === "" || text === "") {

        alert("Заполни поля");

        return;

    }



    let card = document.createElement("div");


    card.innerHTML = `

    <h4>${title}</h4>

    <p>${text}</p>

    `;



    memoryList.appendChild(card);



    memories.push(title);



    memoryCount.innerText =
    memories.length + " воспоминаний";



    titleInput.value = "";

    textInput.value = "";



    memoryBox.classList.add("hidden");


};