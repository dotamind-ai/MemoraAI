// =====================================
// MEMORA ONLINE STATUS
// =====================================

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
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        return;

    }


    if (
        !data.session
    ) {

        console.log(
            "No session"
        );

        return;

    }


    userId =
        data.session.user.id;


    console.log(
        "ONLINE USER:",
        userId
    );


    await updateOnlineStatus(
        true
    );


    // обновляем каждые 30 секунд

    setInterval(
        async function() {

            await updateOnlineStatus(
                true
            );

        },
        30000
    );


    // при выходе со страницы

    window.addEventListener(
        "beforeunload",
        function() {

            updateOnlineStatus(
                false
            );

        }
    );


    // когда вкладка скрыта

    document.addEventListener(
        "visibilitychange",
        function() {


            if (
                document.hidden
            ) {

                updateOnlineStatus(
                    false
                );

            } else {

                updateOnlineStatus(
                    true
                );

            }


        }
    );

}


// =====================================
// UPDATE STATUS
// =====================================

async function updateOnlineStatus(
    status
) {


    if (!userId) {

        return;

    }


    const {
        data,
        error
    } =
    await supabaseClient
        .from("profiles")
        .update({

            is_online:
                status,

            last_seen:
                new Date()

        })
        .eq(
            "id",
            userId
        )
        .select();



    if (error) {

        console.error(
            "STATUS ERROR:",
            error
        );

        return;

    }


    console.log(
        "STATUS UPDATED:",
        data
    );

}


// =====================================
// START AFTER PAGE LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);