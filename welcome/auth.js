/* =====================================
        MEMORA AUTH SYSTEM
        LOCAL STORAGE VERSION
===================================== */


// Ключ для хранения пользователя

const USER_KEY = "memora_user";





// Кнопки

const loginButton = document.querySelector(".auth-login");

const registerButton = document.querySelector(".auth-register");







/* =====================================
        CREATE ACCOUNT
===================================== */


registerButton.addEventListener("click", function(){



    const username = prompt(
        "Введите логин:"
    );



    if(!username){

        return;

    }





    const password = prompt(
        "Введите пароль:"
    );



    if(!password){

        return;

    }






    const user = {


        username: username,


        password: password


    };





    localStorage.setItem(

        USER_KEY,

        JSON.stringify(user)

    );






    alert(
        "Аккаунт создан"
    );





    openMemora();




});









/* =====================================
        LOGIN
===================================== */


loginButton.addEventListener("click", function(){



    const savedUser = localStorage.getItem(USER_KEY);





    if(!savedUser){


        alert(
            "Аккаунт не найден. Создайте его."
        );


        return;


    }





    const user = JSON.parse(savedUser);







    const username = prompt(

        "Логин:"

    );





    const password = prompt(

        "Пароль:"

    );







    if(

        username === user.username &&

        password === user.password

    ){



        openMemora();



    }

    else{


        alert(

            "Неверный логин или пароль"

        );


    }





});










/* =====================================
        OPEN APP
===================================== */


function openMemora(){



    window.location.href = "../index.html";



}