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
            "Session error:",
            error
        );

        return;

    }



    if(
        !data.session
    ){

        console.log(
            "No session"
        );

        return;

    }



    userId =
        data.session.user.id;



    console.log(
        "Online status started:",
        userId
    );



    // ставим онлайн сразу

    await setOnline();



    // обновляем каждые 30 секунд

    setInterval(
        async function(){

            await setOnline();

        },
        30000
    );



    // когда вкладка скрыта

    document.addEventListener(
        "visibilitychange",
        async function(){


            if(
                document.hidden
            ){

                await setOffline();


            }
            else
            {

                await setOnline();

            }


        }
    );



}



// =====================================
// ONLINE
// =====================================

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
            "ONLINE ERROR:",
            error
        );

    }

}



// =====================================
// OFFLINE
// =====================================

async function setOffline(){


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
                false,

            last_seen:
                new Date()

        })
        .eq(
            "id",
            userId
        );



    if(error){

        console.log(
            "OFFLINE ERROR:",
            error
        );

    }


}