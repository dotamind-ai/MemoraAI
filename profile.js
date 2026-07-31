// =====================================================
// MEMORA PROFILE
// SUPABASE
// =====================================================


const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =====================================================
// ELEMENTS
// =====================================================


const profileEmail =
    document.getElementById("profileEmail");


const emailValue =
    document.getElementById("emailValue");


const memoryTotal =
    document.getElementById("memoryTotal");


const accountDate =
    document.getElementById("accountDate");


const logoutButton =
    document.getElementById("logoutButton");


const backButton =
    document.getElementById("backButton");


const homeNav =
    document.getElementById("homeNav");


const calendarNav =
    document.getElementById("calendarNav");


const eventsNav =
    document.getElementById("eventsNav");



// =====================================================
// INITIALIZE
// =====================================================


document.addEventListener(
    "DOMContentLoaded",
    loadProfile
);


async function loadProfile() {


    const {
        data,
        error
    } = await supabaseClient.auth.getUser();


    if (error || !data.user) {

        window.location.href =
            "welcome/welcome.html";

        return;

    }


    const user =
        data.user;


    // Email

    const email =
        user.email || "No email";


    profileEmail.textContent =
        email;


    emailValue.textContent =
        email;



    // Account creation date

    if (user.created_at) {


        const date =
            new Date(
                user.created_at
            );


        accountDate.textContent =
            date.toLocaleDateString(
                "ru-RU",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

    }



    // Load memory count

    await loadMemoryCount();

}



// =====================================================
// MEMORY COUNT
// =====================================================


async function loadMemoryCount() {


    const {
        count,
        error
    } = await supabaseClient

        .from("memories")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        );


    if (error) {


        console.error(
            "Memory count error:",
            error
        );


        memoryTotal.textContent =
            "—";


        return;

    }


    memoryTotal.textContent =
        count || 0;

}



// =====================================================
// LOGOUT
// =====================================================


logoutButton.addEventListener(
    "click",
    async function () {


        logoutButton.disabled =
            true;


        logoutButton.querySelector(
            ".logout-text strong"
        ).textContent =
            "Logging out...";


        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {


            console.error(
                "Logout error:",
                error
            );


            logoutButton.disabled =
                false;


            logoutButton.querySelector(
                ".logout-text strong"
            ).textContent =
                "Log out";


            alert(
                "Unable to log out. Please try again."
            );


            return;

        }



        // Очищаем старый локальный флаг

        localStorage.removeItem(
            "memoraAuth"
        );


        // Возвращаемся на Welcome

        window.location.href =
            "welcome/welcome.html";

    }
);



// =====================================================
// BACK
// =====================================================


backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "index.html";

    }
);



// =====================================================
// NAVIGATION
// =====================================================


homeNav.addEventListener(
    "click",
    function () {

        window.location.href =
            "index.html";

    }
);


calendarNav.addEventListener(
    "click",
    function () {

        window.location.href =
            "calendar.html";

    }
);


eventsNav.addEventListener(
    "click",
    function () {

        window.location.href =
            "events.html";

    }
);



// =====================================================
// SUPABASE SESSION LISTENER
// =====================================================


supabaseClient.auth.onAuthStateChange(
    function (event, session) {


        if (
            event === "SIGNED_OUT" ||
            !session
        ) {

            window.location.href =
                "welcome/welcome.html";

        }

    }
);