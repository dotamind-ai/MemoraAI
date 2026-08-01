const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


let userId = null;


// =====================================
// START
// =====================================

async function startOnlineStatus() {


    const {
        data
    } = await supabaseClient.auth.getSession();


    if (!data.session) {

        return;

    }


    userId =
        data.session.user.id;


    await setOnline();


    // обновляем только время активности
    setInterval(
        async () => {

            await updateLastSeen();

        },
        30000
    );


    // выход из аккаунта
    supabaseClient.auth.onAuthStateChange(
        async function(event) {


            if (
                event === "SIGNED_OUT"
            ) {

                await setOffline();

            }


        }
    );


    // закрытие страницы
    window.addEventListener(
        "pagehide",
        function() {

            setOffline();

        }
    );


}



// =====================================
// ONLINE
// =====================================

async function setOnline() {


    if (!userId) {

        return;

    }


    await supabaseClient
        .from("profiles")
        .update({

            is_online: true,

            last_seen:
                new Date()

        })
        .eq(
            "id",
            userId
        );

}



// =====================================
// UPDATE TIME
// =====================================

async function updateLastSeen() {


    if (!userId) {

        return;

    }


    await supabaseClient
        .from("profiles")
        .update({

            last_seen:
                new Date()

        })
        .eq(
            "id",
            userId
        );

}



// =====================================
// OFFLINE
// =====================================

async function setOffline() {


    if (!userId) {

        return;

    }


    await supabaseClient
        .from("profiles")
        .update({

            is_online: false,

            last_seen:
                new Date()

        })
        .eq(
            "id",
            userId
        );

}



// запуск

document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);