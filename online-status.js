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


    if (
        !data.session
    ) {

        return;

    }


    userId =
        data.session.user.id;


    await setOnline(true);



    // проверка каждые 30 секунд
    setInterval(
        async () => {

            await setOnline(true);

        },
        30000
    );


    // когда закрыли страницу
    window.addEventListener(
        "beforeunload",
        function() {

            setOffline();

        }
    );


    // когда вкладка скрыта
    document.addEventListener(
        "visibilitychange",
        function() {

            if (
                document.hidden
            ) {

                setOffline();

            } else {

                setOnline(true);

            }

        }
    );

}



// =====================================
// ONLINE
// =====================================

async function setOnline(
    value
) {

    if (!userId) {

        return;

    }


    await supabaseClient
        .from("profiles")
        .update({

            is_online:
                value,

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

            is_online:
                false,

            last_seen:
                new Date()

        })
        .eq(
            "id",
            userId
        );

}



// запуск после загрузки
document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);