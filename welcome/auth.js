// =====================================================
// MEMORA AUTH
// welcome/auth.js
// =====================================================

const authTitle = document.getElementById("authTitle");
const authButton = document.getElementById("authButton");
const switchButton = document.getElementById("switchButton");

const loginInput = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");

const authMessage = document.getElementById("authMessage");

let mode = "login";


// =====================================================
// ПЕРЕКЛЮЧЕНИЕ LOGIN / REGISTER
// =====================================================

switchButton.addEventListener("click", function () {

    if (mode === "login") {

        mode = "register";

        authTitle.textContent = "Create account";
        authButton.textContent = "Create account";
        switchButton.textContent = "Already have an account";

    } else {

        mode = "login";

        authTitle.textContent = "Welcome back";
        authButton.textContent = "Login";
        switchButton.textContent = "Create account";

    }

    loginInput.value = "";
    passwordInput.value = "";
    authMessage.textContent = "";

});


// =====================================================
// ОСНОВНАЯ КНОПКА
// =====================================================

authButton.addEventListener("click", function () {

    const login = loginInput.value.trim();
    const password = passwordInput.value;

    if (!login || !password) {

        authMessage.textContent =
            "Enter login and password";

        return;

    }


    // =================================================
    // РЕГИСТРАЦИЯ
    // =================================================

    if (mode === "register") {

        const user = {
            login: login,
            password: password
        };


        localStorage.setItem(
            "memoraUser",
            JSON.stringify(user)
        );


        // Ставим флаг авторизации

        localStorage.setItem(
            "memoraAuth",
            "true"
        );


        authMessage.textContent =
            "Account created";


        setTimeout(function () {

            window.location.href =
                "https://dotamind-ai.github.io/MemoraAI/";

        }, 500);


        return;

    }


    // =================================================
    // LOGIN
    // =================================================

    const savedUser =
        localStorage.getItem("memoraUser");


    if (!savedUser) {

        authMessage.textContent =
            "Create an account first";

        return;

    }


    let user;

    try {

        user = JSON.parse(savedUser);

    } catch (error) {

        localStorage.removeItem("memoraUser");

        authMessage.textContent =
            "Account data is invalid";

        return;

    }


    if (
        user.login === login &&
        user.password === password
    ) {

        // Авторизация успешна

        localStorage.setItem(
            "memoraAuth",
            "true"
        );


        authMessage.textContent =
            "Login successful";


        // Переход на ОСНОВНУЮ MEMORA

        setTimeout(function () {

            window.location.href =
                "https://dotamind-ai.github.io/MemoraAI/";

        }, 500);


    } else {

        authMessage.textContent =
            "Wrong login or password";

    }

});