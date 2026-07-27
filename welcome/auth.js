// =====================================
// MEMORA SIMPLE AUTH
// =====================================


const loginButton = document.getElementById("loginBtn");
const registerButton = document.getElementById("registerBtn");




// регистрация

if(registerButton){

registerButton.addEventListener("click", function(){


    const login = document.getElementById("registerLogin").value;
    const password = document.getElementById("registerPassword").value;



    if(!login || !password){

        alert("Заполните все поля");
        return;

    }



    localStorage.setItem(
        "memora_user",
        JSON.stringify({

            login: login,
            password: password

        })

    );



    alert("Аккаунт создан");


    window.location.href="welcome.html";



});


}






// вход

if(loginButton){


loginButton.addEventListener("click", function(){


    const login = document.getElementById("loginLogin").value;
    const password = document.getElementById("loginPassword").value;



    const user = JSON.parse(
        localStorage.getItem("memora_user")
    );



    if(!user){

        alert("Аккаунт не найден");
        return;

    }




    if(
        login === user.login &&
        password === user.password
    ){


        sessionStorage.setItem(
            "memora_inside",
            "true"
        );



        window.location.href="../index.html";



    }

    else{


        alert("Неверный логин или пароль");


    }



});


}