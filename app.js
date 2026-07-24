const addMemory = document.getElementById("addMemory");
const memoryBox = document.getElementById("memoryBox");
const saveMemory = document.getElementById("saveMemory");

const titleInput = document.getElementById("memoryTitle");
const textInput = document.getElementById("memoryText");

const memoryList = document.getElementById("memoryList");
const memoryCount = document.getElementById("memoryCount");

const typeButtons = document.querySelectorAll(".type-button");


let memories = JSON.parse(
    localStorage.getItem("memora")
) || [];


let selectedType = "idea";




// выбор типа памяти

typeButtons.forEach(button => {

    button.addEventListener("click",()=>{


        selectedType = button.dataset.type;


        typeButtons.forEach(btn =>
            btn.classList.remove("active")
        );


        button.classList.add("active");


    });

});





addMemory.onclick = ()=>{

    memoryBox.classList.remove("hidden");

};







function saveData(){

    localStorage.setItem(
        "memora",
        JSON.stringify(memories)
    );

}






function renderMemories(){


    memoryList.innerHTML="";



    memories.sort((a,b)=>{

        return Number(b.favorite)-Number(a.favorite);

    });





    memories.forEach((memory,index)=>{


        const card=document.createElement("div");


        card.className =
        "memory-card " + memory.type;




        if(memory.favorite){

            card.classList.add("favorite");

        }




        card.innerHTML = `


        <div class="card-top">

            <span class="memory-icon">

            ${memory.icon}

            </span>


            <span>

            ${memory.category}

            </span>

        </div>



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
        .onclick=()=>{


            memory.favorite =
            !memory.favorite;


            saveData();

            renderMemories();


        };







        card.querySelector(".deleteButton")
        .onclick=()=>{


            memories.splice(index,1);


            saveData();

            renderMemories();


        };





        memoryList.appendChild(card);


    });





    memoryCount.textContent =
    memories.length+" воспоминаний";


}







saveMemory.onclick=()=>{


    const title =
    titleInput.value.trim();


    const text =
    textInput.value.trim();




    if(!title){

        alert("Заполни название памяти");

        return;

    }




    const data = {


        title:title,


        text:text || "Без текста",



        type:selectedType,



        category:getCategory(selectedType),



        icon:getIcon(selectedType),



        favorite:false


    };





    memories.unshift(data);



    saveData();


    renderMemories();



    titleInput.value="";

    textInput.value="";


    memoryBox.classList.add("hidden");


};







function getCategory(type){


    const list={

        idea:"Идея",

        goal:"Цель",

        note:"Заметка",

        project:"Проект",

        personal:"Личное"

    };


    return list[type] || "Память";


}






function getIcon(type){


    const icons={

        idea:"◇",

        goal:"◎",

        note:"▤",

        project:"◈",

        personal:"◉"

    };


    return icons[type] || "◇";


}







renderMemories();