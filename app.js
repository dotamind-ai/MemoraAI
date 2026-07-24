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


    console.log(
        "Сохранено:",
        memories
    );

}



function render(){

    memoryList.innerHTML = "";


    memories.forEach((item)=>{


        let card = document.createElement("div");


        card.innerHTML = `

        <h4>💡 ${item.title}</h4>

        <p>${item.text}</p>

        <small>${item.date}</small>

        `;


        memoryList.appendChild(card);


    });


    memoryCount.innerText =
    memories.length + " воспоминаний";

}




addMemory.onclick = ()=>{

    memoryBox.classList.remove("hidden");

};




saveMemory.onclick = ()=>{


    let newMemory = {

        title:titleInput.value,

        text:textInput.value,

        date:new Date()
        .toLocaleDateString()

    };



    memories.push(newMemory);



    saveData();


    render();



    titleInput.value="";

    textInput.value="";


    memoryBox.classList.add("hidden");


};




render();