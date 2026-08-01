// =====================================================
// MEMORA ONLINE STATUS
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



async function startOnlineStatus(){

    const {
        data,
        error
    } =
    await onlineSupabase
        .auth
        .getSession();


    if(error){

        console.error(
            "Online status error",
            error
        );

        return;

    }


    if(
        !data.session
    ){

        return;

    }


    onlineUser =
    data.session.user;


    setUserOnline();


    // обновляем каждые 60 секунд

    setInterval(
        setUserOnline,
        60000
    );


    // когда закрываем вкладку

    window.addEventListener(
        "beforeunload",
        setUserOffline
    );

}



// =====================================================
// ONLINE
// =====================================================

async function setUserOnline(){

    if(!onlineUser){
        return;
    }


    await onlineSupabase
        .from("profiles")
        .update({

            is_online:true,

            last_seen:
            new Date(),

            updated_at:
            new Date()

        })
        .eq(
            "id",
            onlineUser.id
        );

}



// =====================================================
// OFFLINE
// =====================================================

async function setUserOffline(){

    if(!onlineUser){
        return;
    }


    await onlineSupabase
        .from("profiles")
        .update({

            is_online:false,

            last_seen:
            new Date(),

            updated_at:
            new Date()

        })
        .eq(
            "id",
            onlineUser.id
        );

}