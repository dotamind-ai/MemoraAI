const saveMemory = document.getElementById("saveMemory");
const memoryList = document.getElementById("memoryList");

let testData = JSON.parse(
    localStorage.getItem("testMemora")
) || [];


function showData(){

    memoryList.innerHTML = "";

    testData.forEach(item => {

        let div = document.createElement("div");

        div.innerHTML = item;

        memoryList.appendChild(div);

    });

}



saveMemory.onclick = function(){

    let text = document.getElementById("memoryTitle").value;


    testData.push(text);


    localStorage.setItem(
        "testMemora",
        JSON.stringify(testData)
    );


    showData();


    alert("Сохранено: " + text);

};



showData();