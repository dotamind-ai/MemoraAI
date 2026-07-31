// ==================================================
// MEMORA AUTH
// LOCAL STORAGE
// ==================================================


const authTitle =
    document.getElementById("authTitle");


const authButton =
    document.getElementById("authButton");


const switchButton =
    document.getElementById("switchButton");


const loginInput =
    document.getElementById("loginInput");


const passwordInput =
    document.getElementById("passwordInput");


const authMessage =
    document.getElementById("authMessage");



let mode = "login";



// ==================================================
// SWITCH LOGIN / REGISTER
// ==================================================


switchButton.addEventListener("click", function(){

    mode =
        mode === "login"
        ? "register"
        : "login";


    loginInput.value = "";

    passwordInput.value = "";

    authMessage.textContent = "";


    if(mode === "register"){

        authTitle.textContent =
            "Create account";


        authButton.textContent =
            "Create account";


        switchButton.textContent =
            "Already have an account";

        passwordInput.autocomplete =
            "new-password";

    }

    else{

        authTitle.textContent =
            "Welcome back";


        authButton.textContent =
            "Login";


        switchButton.textContent =
            "Create account";

        passwordInput.autocomplete =
            "current-password";

    }

});



// ==================================================
// MAIN BUTTON
// ==================================================


authButton.addEventListener("click", function(){

    const login =
        loginInput.value.trim();


    const password =
        passwordInput.value;


    if(!login || !password){

        authMessage.textContent =
            "Enter login and password";

        return;

    }



    // ==============================================
    // REGISTER
    // ==============================================


    if(mode === "register"){

        const saved =
            localStorage.getItem("memoraUser");


        if(saved){

            const existing =
                JSON.parse(saved);


            if(existing.login === login){

                authMessage.textContent =
                    "This login is already registered";

                return;

            }

        }


        const user = {

            login:login,

            password:password

        };


        localStorage.setItem(
            "memoraUser",
            JSON.stringify(user)
        );


        localStorage.setItem(
            "memoraAuth",
            "true"
        );


        authMessage.textContent =
            "Account created";


        setTimeout(function(){

            window.location.href =
                "../index.html";

        },500);


        return;

    }



    // ==============================================
    // LOGIN
    // ==============================================


    const saved =
        localStorage.getItem("memoraUser");


    if(!saved){

        authMessage.textContent =
            "Create an account first";

        return;

    }


    const user =
        JSON.parse(saved);


    if(
        user.login === login &&
        user.password === password
    ){

        localStorage.setItem(
            "memoraAuth",
            "true"
        );


        authMessage.textContent =
            "Login successful";


        setTimeout(function(){

            window.location.href =
                "../index.html";

        },300);


    }

    else{

        authMessage.textContent =
            "Wrong login or password";

    }

});
