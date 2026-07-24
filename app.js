const addMemoryButton = document.getElementById("addMemory");


addMemoryButton.addEventListener("click", function () {

    const memory = prompt("Что ты хочешь сохранить в память?");


    if (memory) {

        alert(
            "Память сохранена:\n\n" + memory
        );

    }

});