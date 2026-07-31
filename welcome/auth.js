// =====================================================
// MEMORA + SUPABASE AUTH
// =====================================================


// -----------------------------------------------------
// SUPABASE CONFIG
// -----------------------------------------------------

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



// -----------------------------------------------------
// ELEMENTS
// -----------------------------------------------------

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



// -----------------------------------------------------
// MESSAGE
// -----------------------------------------------------

function showMessage(message) {

    authMessage.textContent = message;

}



// -----------------------------------------------------
// SWITCH LOGIN / REGISTER
// -----------------------------------------------------

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


            loginInput.value = "";

            passwordInput.value = "";

            showMessage("");


            passwordInput.autocomplete =
                "new-password";


        } else {


            mode = "login";


            authTitle.textContent =
                "Welcome back";


            authButton.textContent =
                "Login";


            switchButton.textContent =
                "Create account";


            loginInput.value = "";

            passwordInput.value = "";

            showMessage("");


            passwordInput.autocomplete =
                "current-password";

        }

    }
);



// -----------------------------------------------------
// MAIN AUTH BUTTON
// -----------------------------------------------------

authButton.addEventListener(
    "click",
    async function () {


        const email =
            loginInput.value.trim();


        const password =
            passwordInput.value;



        // Проверяем поля

        if (!email || !password) {

            showMessage(
                "Enter email and password"
            );

            return;

        }



        // Простая проверка email

        if (!email.includes("@")) {

            showMessage(
                "Enter a valid email"
            );

            return;

        }



        // =============================================
        // REGISTER
        // =============================================

        if (mode === "register") {


            showMessage(
                "Creating account..."
            );


            try {


                const {
                    data,
                    error
                } = await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        emailRedirectTo:
                            "https://dotamind-ai.github.io/MemoraAI/welcome/welcome.html"

                    }

                });



                if (error) {

                    console.error(error);

                    showMessage(
                        error.message
                    );

                    return;

                }



                // Если подтверждение email включено,
                // session обычно отсутствует.

                if (!data.session) {


                    showMessage(
                        "Account created. Check your email to confirm your account."
                    );


                    loginInput.value = "";

                    passwordInput.value = "";


                    return;

                }



                // На случай если confirmation
                // отключён

                localStorage.setItem(
                    "memoraAuth",
                    "true"
                );


                window.location.href =
                    "https://dotamind-ai.github.io/MemoraAI/";


            }

            catch (error) {


                console.error(error);


                showMessage(
                    "Registration error"
                );

            }


            return;

        }



        // =============================================
        // LOGIN
        // =============================================

        showMessage(
            "Signing in..."
        );


        try {


            const {
                data,
                error
            } = await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });



            if (error) {

                console.error(error);

                showMessage(
                    error.message
                );

                return;

            }



            if (!data.session) {

                showMessage(
                    "Login failed"
                );

                return;

            }



            // Авторизация успешна

            localStorage.setItem(
                "memoraAuth",
                "true"
            );



            showMessage(
                "Login successful"
            );



            // Переход в основную Memora

            setTimeout(
                function () {

                    window.location.href =
                        "https://dotamind-ai.github.io/MemoraAI/";

                },
                500
            );


        }

        catch (error) {


            console.error(error);


            showMessage(
                "Login error"
            );

        }

    }
);



// -----------------------------------------------------
// ENTER KEY
// -----------------------------------------------------

passwordInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            authButton.click();

        }

    }
);



// -----------------------------------------------------
// CHECK EXISTING SUPABASE SESSION
// -----------------------------------------------------

async function checkExistingSession() {


    try {


        const {
            data
        } = await supabaseClient.auth.getSession();



        if (data.session) {


            localStorage.setItem(
                "memoraAuth",
                "true"
            );


            // Если пользователь уже авторизован,
            // можно сразу открыть Memora.

            window.location.href =
                "https://dotamind-ai.github.io/MemoraAI/";

        }

    }

    catch (error) {

        console.error(
            "Session check error:",
            error
        );

    }

}


checkExistingSession();