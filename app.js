const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


addMemory.addEventListener("click", function(){

    memoryBox.classList.remove("hidden");

});


saveMemory.addEventListener("click", function(){


    const title = titleInput.value;
    const text = textInput.value;


    if(title === "" || text === ""){

        alert("Заполни оба поля");

        return;

    }


    const card = document.createElement("div");


    card.style.marginTop = "15px";
    card.style.padding = "20px";
    card.style.borderRadius = "20px";
    card.style.background = "rgba(255,255,255,0.1)";


    card.innerHTML = 
    `
    <h4>${title}</h4>
    <p>${text}</p>
    `;


    memoryList.appendChild(card);


    memoryCount.innerText = "1 воспоминание";


    titleInput.value = "";
    textInput.value = "";


    memoryBox.classList.add("hidden");


});