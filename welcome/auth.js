// =====================================
// MEMORA AUTH SYSTEM
// =====================================


// Получаем элементы

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");




// ==============================
// РЕГИСТРАЦИЯ
// ==============================


if(registerBtn){

    registerBtn.onclick = function(){


        let login =
        document.getElementById("registerLogin").value;


        let password =
        document.getElementById("registerPassword").value;



        if(login === "" || password === ""){

            alert("Введите логин и пароль");

            return;

        }



        let user = {

            login: login,

            password: password

        };



        localStorage.setItem(
            "memora_user",
            JSON.stringify(user)
        );



        alert("Аккаунт создан");


        // возвращаемся на вход

        window.location.href="welcome.html";



    };


}






// ==============================
// ВХОД
// ==============================


if(loginBtn){


    loginBtn.onclick = function(){


        let login =
        document.getElementById("loginLogin").value;



        let password =
        document.getElementById("loginPassword").value;



        let savedUser =
        localStorage.getItem("memora_user");



        if(!savedUser){


            alert("Сначала создайте аккаунт");


            return;


        }




        let user =
        JSON.parse(savedUser);






        if(
            login === user.login &&
            password === user.password
        ){



            // запоминаем вход


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



    };


}