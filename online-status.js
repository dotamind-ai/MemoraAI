// =====================================================
// MEMORA ONLINE STATUS
// =====================================================
// Управляет:
// - статусом пользователя в сети
// - временем последнего посещения
// =====================================================


const ONLINE_SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const ONLINE_SUPABASE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const onlineSupabase =
    window.supabase.createClient(
        ONLINE_SUPABASE_URL,
        ONLINE_SUPABASE_KEY
    );


let onlineUser = null;


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);



async function startOnlineStatus() {

    try {


        const {
            data,
            error
        } =
        await onlineSupabase
            .auth
            .getSession();



        if (error) {

            console.error(
                "Online session error:",
                error
            );

            return;

        }



        if (
            !data.session
        ) {

            return;

        }



        onlineUser =
            data.session.user;



        await setOnline();



        // Когда вкладка закрывается
        window.addEventListener(
            "beforeunload",
            function() {

                setOffline();

            }
        );


        // Если вкладка стала активной
        document.addEventListener(
            "visibilitychange",
            function() {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    setOnline();

                }

            }
        );



    } catch(error) {

        console.error(
            "Online status error:",
            error
        );

    }

}



// =====================================================
// ONLINE
// =====================================================

async function setOnline() {

    if (!onlineUser) {
        return;
    }


    const {
        error
    } =
    await onlineSupabase
        .from("profiles")
        .update({

            is_online:
                true,

            last_seen:
                new Date()

        })
        .eq(
            "id",
            onlineUser.id
        );


    if(error) {

        console.error(
            "Set online error:",
            error
        );

    }

}



// =====================================================
// OFFLINE
// =====================================================

function setOffline() {

    if (!onlineUser) {
        return;
    }


    onlineSupabase
        .from("profiles")
        .update({

            is_online:
                false,

            last_seen:
                new Date()

        })
        .eq(
            "id",
            onlineUser.id
        );

}