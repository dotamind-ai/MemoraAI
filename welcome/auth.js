// =====================================================
// MEMORA
// SUPABASE AUTHENTICATION
// =====================================================


// =====================================================
// SUPABASE CONFIG
// =====================================================

const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


// Создаём Supabase client

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );



// =====================================================
// HTML ELEMENTS
// =====================================================

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



// =====================================================
// CURRENT MODE
// =====================================================

let mode = "login";



// =====================================================
// MESSAGE
// =====================================================

function showMessage(message) {

    authMessage.textContent = message;

}



// =====================================================
// LOGIN / REGISTER SWITCH
// =====================================================

switchButton.addEventListener(
    "click",
    function () {


        if (mode === "login") {


            mode = "register";


            authTitle.textContent =
                "Create account";


            authButton.textContent =
                "Create account";


            switchButton.textContent =
                "Already have an account";


            passwordInput.autocomplete =
                "new-password";


        }

        else {


            mode = "login";


            authTitle.textContent =
                "Welcome back";


            authButton.textContent =
                "Login";


            switchButton.textContent =
                "Create account";


            passwordInput.autocomplete =
                "current-password";

        }


        loginInput.value = "";

        passwordInput.value = "";

        showMessage("");

    }
);



// =====================================================
// MAIN AUTH BUTTON
// =====================================================

authButton.addEventListener(
    "click",
    async function () {


        const email =
            loginInput.value.trim();


        const password =
            passwordInput.value;



        // ---------------------------------------------
        // Проверка Email
        // ---------------------------------------------

        if (!email) {

            showMessage(
                "Enter your email"
            );

            return;

        }


        if (!email.includes("@")) {

            showMessage(
                "Enter a valid email"
            );

            return;

        }



        // ---------------------------------------------
        // Проверка пароля
        // ---------------------------------------------

        if (!password) {

            showMessage(
                "Enter your password"
            );

            return;

        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters"
            );

            return;

        }



        // =================================================
        // REGISTER
        // =================================================

        if (mode === "register") {


            showMessage(
                "Creating account..."
            );


            try {


                const result =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            emailRedirectTo:
                                "https://dotamind-ai.github.io/MemoraAI/welcome/welcome.html"

                        }

                    });



                const data =
                    result.data;


                const error =
                    result.error;



                // Ошибка Supabase

                if (error) {


                    console.error(
                        "Supabase registration error:",
                        error
                    );


                    showMessage(
                        error.message
                    );


                    return;

                }



                // -----------------------------------------
                // Email confirmation включён
                // -----------------------------------------

                if (!data.session) {


                    showMessage(
                        "Account created. Check your email and confirm your account."
                    );


                    loginInput.value = "";

                    passwordInput.value = "";


                    return;

                }



                // -----------------------------------------
                // Если подтверждение не требуется
                // -----------------------------------------

                localStorage.setItem(
                    "memoraAuth",
                    "true"
                );


                showMessage(
                    "Account created"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "https://dotamind-ai.github.io/MemoraAI/";

                    },
                    500
                );


            }

            catch (error) {


                console.error(
                    "Registration error:",
                    error
                );


                showMessage(
                    "Registration error"
                );

            }


            return;

        }



        // =================================================
        // LOGIN
        // =================================================

        showMessage(
            "Signing in..."
        );


        try {


            const result =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });



            const data =
                result.data;


            const error =
                result.error;



            // Ошибка

            if (error) {


                console.error(
                    "Supabase login error:",
                    error
                );


                showMessage(
                    error.message
                );


                return;

            }



            // Нет сессии

            if (!data.session) {


                showMessage(
                    "Login failed"
                );


                return;

            }



            // -----------------------------------------
            // Успешный вход
            // -----------------------------------------

            localStorage.setItem(
                "memoraAuth",
                "true"
            );


            showMessage(
                "Login successful"
            );


            // Переходим на основную Memora

            setTimeout(
                function () {

                    window.location.href =
                        "https://dotamind-ai.github.io/MemoraAI/";

                },
                500
            );


        }

        catch (error) {


            console.error(
                "Login error:",
                error
            );


            showMessage(
                "Login error"
            );

        }

    }
);



// =====================================================
// ENTER KEY
// =====================================================

passwordInput.addEventListener(
    "keydown",
    function (event) {


        if (event.key === "Enter") {

            authButton.click();

        }

    }
);



// =====================================================
// CHECK EXISTING SESSION
// =====================================================

async function checkSession() {


    try {


        const result =
            await supabaseClient.auth.getSession();


        const session =
            result.data.session;



        if (session) {


            localStorage.setItem(
                "memoraAuth",
                "true"
            );


            window.location.href =
                "https://dotamind-ai.github.io/MemoraAI/";

        }


    }

    catch (error) {


        console.error(
            "Session error:",
            error
        );

    }

}


checkSession();