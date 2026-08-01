// =====================================================
// MEMORA ONLINE STATUS
// SUPABASE
// =====================================================

alert("online-status.js loaded");
const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



let onlineUserId = null;



// =====================================================
// START
// =====================================================

async function startOnlineStatus() {


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



    onlineUserId =
        data.session.user.id;



    // сразу ставим онлайн

    await updateOnlineStatus(
        true
    );



    // обновляем каждые 30 секунд

    setInterval(
        function(){

            updateOnlineStatus(
                true
            );

        },
        30000
    );



    // если вкладка скрыта

    document.addEventListener(
        "visibilitychange",
        function(){


            if(
                document.hidden
            ){

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



// =====================================================
// UPDATE
// =====================================================

async function updateOnlineStatus(
    status
){


    if(
        !onlineUserId
    ){

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
        onlineUserId
    );



}



// =====================================================
// LOGOUT SUPPORT
// =====================================================

window.addEventListener(
    "beforeunload",
    function(){

        updateOnlineStatus(
            false
        );

    }
);



// =====================================================
// RUN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);