// =====================================================
// MEMORA AUTHENTICATION
// welcome/auth.js
// =====================================================


// Получаем элементы из welcome.html

const authTitle = document.getElementById("authTitle");
const authButton = document.getElementById("authButton");
const switchButton = document.getElementById("switchButton");

const loginInput = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");

const authMessage = document.getElementById("authMessage");


// Текущий режим:
// login     = вход
// register  = регистрация

let mode = "login";



// =====================================================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
// =====================================================

function showMessage(text) {

    authMessage.textContent = text;

}



// =====================================================
// ПЕРЕКЛЮЧЕНИЕ ВХОД / РЕГИСТРАЦИЯ
// =====================================================

switchButton.addEventListener("click", function () {


    if (mode === "login") {


        mode = "register";


        authTitle.textContent =
            "Create account";


        authButton.textContent =
            "Create account";


        switchButton.textContent =
            "Already have an account";


    } else {


        mode = "login";


        authTitle.textContent =
            "Welcome back";


        authButton.textContent =
            "Login";


        switchButton.textContent =
            "Create account";

    }



    // очищаем поля

    loginInput.value = "";

    passwordInput.value = "";

    showMessage("");

});



// =====================================================
// ОСНОВНАЯ КНОПКА
// =====================================================

authButton.addEventListener("click", function () {


    const login =
        loginInput.value.trim();


    const password =
        passwordInput.value;



    // Проверяем поля

    if (login === "" || password === "") {


        showMessage(
            "Enter login and password"
        );


        return;

    }



    // =================================================
    // РЕГИСТРАЦИЯ
    // =================================================

    if (mode === "register") {


        // Проверяем, существует ли пользователь

        const savedUser =
            localStorage.getItem("memoraUser");



        if (savedUser) {


            try {


                const existingUser =
                    JSON.parse(savedUser);



                if (existingUser.login === login) {


                    showMessage(
                        "This login is already registered"
                    );


                    return;

                }


            } catch (error) {


                localStorage.removeItem(
                    "memoraUser"
                );

            }

        }



        // Создаём пользователя

        const user = {

            login: login,

            password: password

        };



        // Сохраняем данные

        localStorage.setItem(

            "memoraUser",

            JSON.stringify(user)

        );



        // Ставим флаг авторизации

        localStorage.setItem(

            "memoraAuth",

            "true"

        );



        showMessage(
            "Account created"
        );



        // Переходим на основную Memora

        setTimeout(function () {


            window.location.href =
                "../index.html";


        }, 500);



        return;

    }



    // =================================================
    // ВХОД
    // =================================================

    const savedUser =
        localStorage.getItem("memoraUser");



    // Если аккаунта нет

    if (!savedUser) {


        showMessage(
            "Create an account first"
        );


        return;

    }



    let user;



    try {


        user =
            JSON.parse(savedUser);


    } catch (error) {


        showMessage(
            "Account data is corrupted"
        );


        localStorage.removeItem(
            "memoraUser"
        );


        return;

    }



    // Проверяем логин и пароль

    if (

        user.login === login &&

        user.password === password

    ) {


        // Авторизация успешна

        localStorage.setItem(

            "memoraAuth",

            "true"

        );



        showMessage(
            "Login successful"
        );



        // Переходим из /welcome/
        // обратно в корневой index.html

        setTimeout(function () {


            window.location.href =
                "../index.html";


        }, 300);



    } else {


        showMessage(
            "Wrong login or password"
        );


    }

});



// =====================================================
// ENTER НА КЛАВИАТУРЕ
// =====================================================

passwordInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            authButton.click();

        }

    }
);