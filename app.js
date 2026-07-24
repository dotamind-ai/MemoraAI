const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const typeButtons = document.querySelectorAll(".type-button");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");


let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];


let selectedType = "idea";





typeButtons.forEach(button => {

    button.onclick = () => {

        selectedType = button.dataset.type;


        typeButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");

    };

});






addMemory.onclick = () => {

    memoryBox.classList.remove("hidden");

};







function saveData(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}







function renderMemories(){


    memoryList.innerHTML = "";



    memories.sort((a,b)=>{

        return Number(b.favorite) - Number(a.favorite);

    });





    memories.forEach((memory,index)=>{



        const card = document.createElement("div");


        card.className =
        "memory-card " + memory.type;



        if(memory.favorite){

            card.classList.add("favorite");

        }





        card.innerHTML = `


        <div class="card-icon">

        ${memory.icon || "◇"}

        </div>



        <h4>

        ${memory.type}

        </h4>



        <h3>

        ${memory.title}

        </h3>



        <p>

        ${memory.text}

        </p>



        <button class="favoriteButton">

        ${memory.favorite ? "★ Закреплено" : "☆ Закрепить"}

        </button>



        <button class="deleteButton">

        Удалить

        </button>


        `;






        card.querySelector(".favoriteButton")
        .onclick = ()=>{


            memory.favorite =
            !memory.favorite;


            saveData();

            renderMemories();


        };







        card.querySelector(".deleteButton")
        .onclick = ()=>{


            memories.splice(index,1);


            saveData();

            renderMemories();


        };





        memoryList.appendChild(card);



    });





    memoryCount.textContent =
    memories.length + " воспоминаний";


}








saveMemory.onclick = ()=>{


    const title =
    titleInput.value.trim();


    const text =
    textInput.value.trim();




    if(!title){

        alert("Заполни название памяти");

        return;

    }






    memories.unshift({


        title:title,


        text:text || "Без текста",


        type:selectedType,


        favorite:false,


        icon:
        selectedType === "goal" ? "◎" :
        selectedType === "note" ? "▤" :
        selectedType === "project" ? "◈" :
        selectedType === "personal" ? "◉" :
        "◇"



    });






    saveData();


    renderMemories();



    titleInput.value="";

    textInput.value="";


    memoryBox.classList.add("hidden");


};






renderMemories();