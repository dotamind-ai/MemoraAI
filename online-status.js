// =====================================================
// MEMORA ONLINE STATUS
// =====================================================


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



// ===============================
// START
// ===============================

async function startOnlineStatus() {
    alert("ONLINE SCRIPT WORKS");


    console.log(
        "ONLINE STATUS START"
    );


    const {
        data,
        error
    } = await supabaseClient.auth.getSession();



    if (error) {

        console.log(
            "SESSION ERROR",
            error
        );

        return;

    }



    if (!data.session) {

        console.log(
            "NO SESSION"
        );

        return;

    }



    userId =
        data.session.user.id;



    console.log(
        "USER ID:",
        userId
    );



    await setOnline();



    setInterval(
        function(){

            setOnline();

        },
        30000
    );


}



// ===============================
// SET ONLINE
// ===============================


async function setOnline(){


    if(!userId){

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
                new Date()

        })
        .eq(
            "id",
            userId
        );



    if(error){

        console.log(
            "ONLINE ERROR",
            error
        );

    }
    else{

        console.log(
            "ONLINE TRUE"
        );

    }


}




// ===============================
// SET OFFLINE
// ===============================


async function setOffline(){


    if(!userId){

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




// ===============================
// EVENTS
// ===============================


window.addEventListener(
    "beforeunload",
    function(){

        setOffline();

    }
);



document.addEventListener(
    "visibilitychange",
    function(){

        if(document.hidden){

            setOffline();

        }
        else{

            setOnline();

        }

    }
);



// ===============================
// RUN
// ===============================


document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);