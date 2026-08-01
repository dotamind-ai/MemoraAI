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


let currentUserId = null;



// =====================================
// START
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);



async function startOnlineStatus() {


    const {
        data,
        error
    } =
    await supabaseClient.auth.getSession();



    if(error){

        console.log(
            "Session error",
            error
        );

        return;

    }



    if(
        !data.session
    ){

        console.log(
            "No user"
        );

        return;

    }



    currentUserId =
        data.session.user.id;



    console.log(
        "Online user:",
        currentUserId
    );



    // сразу онлайн

    await setOnline();



    // обновляем время каждые 30 секунд

    setInterval(
        async function(){

            await setOnline();

        },
        30000
    );


}



// =====================================
// SET ONLINE
// =====================================

async function setOnline(){


    if(!currentUserId){

        return;

    }



    const {
        error
    } =
    await supabaseClient
        .from("profiles")
        .update({

            is_online:
                true,

            last_seen:
                new Date().toISOString()

        })
        .eq(
            "id",
            currentUserId
        );



    if(error){

        console.log(
            "Online error:",
            error
        );

    }

}



// =====================================
// SET OFFLINE
// =====================================

async function setOffline(){


    if(!currentUserId){

        return;

    }



    const {
        error
    } =
    await supabaseClient
        .from("profiles")
        .update({

            is_online:
                false,

            last_seen:
                new Date().toISOString()

        })
        .eq(
            "id",
            currentUserId
        );



    if(error){

        console.log(
            "Offline error:",
            error
        );

    }

}



// =====================================
// LOGOUT SUPPORT
// =====================================

supabaseClient.auth.onAuthStateChange(
    async function(
        event
    ){


        if(
            event ===
            "SIGNED_OUT"
        ){

            await setOffline();

        }


    }
);