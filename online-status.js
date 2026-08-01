// ============================================
// MEMORA ONLINE STATUS
// ============================================


const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



let currentUserId = null;



// ============================================
// START
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    initOnlineStatus
);



async function initOnlineStatus() {


    const {
        data,
        error
    } =
    await supabaseClient.auth.getSession();



    if (
        error ||
        !data.session
    ) {

        return;

    }



    currentUserId =
        data.session.user.id;



    // сразу ставим онлайн

    await updateOnlineStatus(true);



    // каждые 30 секунд подтверждаем присутствие

    setInterval(
        function() {

            updateOnlineStatus(true);

        },
        30000
    );



    // когда вкладка скрыта

    document.addEventListener(
        "visibilitychange",
        function() {


            if (
                document.hidden
            ) {

                updateOnlineStatus(false);

            } else {

                updateOnlineStatus(true);

            }


        }
    );



    // выход из аккаунта

    supabaseClient.auth.onAuthStateChange(
        function(
            event
        ) {


            if (
                event === "SIGNED_OUT"
            ) {

                updateOnlineStatus(false);

            }


        }
    );


}



// ============================================
// UPDATE STATUS
// ============================================

async function updateOnlineStatus(
    status
) {


    if (
        !currentUserId
    ) {

        return;

    }



    await supabaseClient

        .from("profiles")

        .update({

            is_online:
                status,


            last_seen:
                new Date()
                .toISOString()


        })

        .eq(
            "id",
            currentUserId
        );


}



// ============================================
// BEFORE CLOSE
// ============================================

window.addEventListener(
    "beforeunload",
    function() {


        if (
            currentUserId
        ) {

            supabaseClient

                .from("profiles")

                .update({

                    is_online:
                        false,


                    last_seen:
                        new Date()
                        .toISOString()

                })

                .eq(
                    "id",
                    currentUserId
                );


        }


    }
);