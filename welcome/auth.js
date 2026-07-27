// =====================================
// MEMORA AUTH SYSTEM
// LOCAL STORAGE VERSION
// =====================================


// регистрация

function register(){


    const login =
    document.getElementById("newLogin").value.trim();


    const password =
    document.getElementById("newPassword").value.trim();



    if(login === "" || password === ""){

        alert("Заполни логин и пароль");

        return;

    }




    const user = {

        login: login,

        password: password

    };




    localStorage.setItem(

        "memora_user",

        JSON.stringify(user)

    );




    alert("Аккаунт создан");



    // очистка

    document.getElementById("newLogin").value="";
    document.getElementById("newPassword").value="";



}









// вход


function login(){


    const login =
    document.getElementById("loginInput").value.trim();


    const password =
    document.getElementById("passwordInput").value.trim();





    const savedUser =

    JSON.parse(

        localStorage.getItem("memora_user")

    );






    if(!savedUser){


        alert("Сначала создай аккаунт");


        return;


    }







    if(

        login === savedUser.login &&

        password === savedUser.password

    ){



        // флаг авторизации


        localStorage.setItem(

            "memora_inside",

            "true"

        );





        // переход в приложение


        window.location.href =

        "../index.html";





    }

    else{


        alert("Неверный логин или пароль");


    }



}









// если пользователь уже вошёл

window.onload=function(){


    if(

        localStorage.getItem("memora_inside")

        ===

        "true"

    ){


        // можно сразу открыть приложение


        // убери комментарий если хочешь авто вход


        // window.location.href="../index.html";


    }



};
/* =====================================
        MEMORA NEURAL BACKGROUND
===================================== */


function createParticles(){


    for(let i = 0; i < 25; i++){


        let particle =
        document.createElement("div");


        particle.className =
        "neural-particle";



        particle.style.left =
        Math.random()*100 + "vw";



        particle.style.animationDuration =
        (8 + Math.random()*12) + "s";



        particle.style.animationDelay =
        Math.random()*10 + "s";



        document.body.appendChild(particle);


    }

}




function createNeuralLines(){


    for(let i = 0; i < 5; i++){


        let line =
        document.createElement("div");



        line.className =
        "neural-line";



        line.style.top =
        Math.random()*100 + "vh";



        line.style.animationDuration =
        (8 + Math.random()*8) + "s";



        line.style.animationDelay =
        Math.random()*5 + "s";



        document.body.appendChild(line);


    }


}






window.addEventListener(
"load",
()=>{


    createParticles();

    createNeuralLines();


});
// =====================================
// MEMORA AI PARTICLES
// =====================================


function createAIParticles(){


    for(let i=0;i<60;i++){


        let p=document.createElement("div");


        p.className="ai-particle";


        p.style.left=
        Math.random()*100+"vw";


        p.style.animationDuration=
        (8+Math.random()*15)+"s";


        p.style.animationDelay=
        Math.random()*10+"s";


        document.body.appendChild(p);


    }


}





function createNeurons(){


    let points=[];



    for(let i=0;i<12;i++){


        let n=document.createElement("div");


        n.className="neuron";


        n.style.left=
        Math.random()*100+"vw";


        n.style.top=
        Math.random()*100+"vh";


        document.body.appendChild(n);



        points.push(n);


    }





    for(let i=0;i<points.length-1;i++){


        let line=document.createElement("div");


        line.className="neuron-line";


        let x1=
        points[i].offsetLeft;


        let y1=
        points[i].offsetTop;


        let x2=
        points[i+1].offsetLeft;


        let y2=
        points[i+1].offsetTop;


        let length=
        Math.sqrt(
        (x2-x1)**2+
        (y2-y1)**2
        );


        let angle=
        Math.atan2(
        y2-y1,
        x2-x1
        );


        line.style.width=
        length+"px";


        line.style.left=
        x1+"px";


        line.style.top=
        y1+"px";


        line.style.transform=
        `rotate(${angle}rad)`;


        document.body.appendChild(line);


    }


}






window.addEventListener(
"load",
()=>{


    createAIParticles();

    createNeurons();


});