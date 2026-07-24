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



function renderMemories() {

    memoryList.innerHTML = "";


    memories.forEach((memory) => {


        const card = document.createElement("div");


        card.innerHTML = `
            <h4>${memory.title}</h4>
            <p>${memory.text}</p>
        `;


        memoryList.appendChild(card);


    });



    memoryCount.textContent =
        memories.length + " воспоминаний";

}



addMemory.addEventListener("click", () => {

    memoryBox.classList.remove("hidden");

});




saveMemory.addEventListener("click", (event) => {


    event.preventDefault();


    const title =
        titleInput.value.trim();


    const text =
        textInput.value.trim();



    if (!title || !text) {

        alert("Заполни оба поля");

        return;

    }



    const newMemory = {

        title: title,

        text: text,

        created:
        new Date().toISOString()

    };



    memories.unshift(newMemory);



    localStorage.setItem(

        "memora",

        JSON.stringify(memories)

    );



    titleInput.value = "";

    textInput.value = "";


    memoryBox.classList.add("hidden");


    renderMemories();


});



renderMemories();