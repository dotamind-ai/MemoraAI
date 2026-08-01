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


// ===============================
// START
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);


async function startOnlineStatus() {


    const {
        data
    } =
    await onlineSupabase
        .auth
        .getSession();


    if (
        !data.session
    ) {

        return;

    }


    onlineUser =
        data.session.user;


    setOnline();


    // проверка каждые 30 секунд

    setInterval(
        setOnline,
        30000
    );


    window.addEventListener(
        "beforeunload",
        setOffline
    );

}



// ===============================
// ONLINE
// ===============================

async function setOnline() {


    if (!onlineUser) {
        return;
    }


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


}



// ===============================
// OFFLINE
// ===============================

async function setOffline() {


    if (!onlineUser) {
        return;
    }


    await onlineSupabase
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