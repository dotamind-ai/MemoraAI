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