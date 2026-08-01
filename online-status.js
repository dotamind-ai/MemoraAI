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


// ================================
// START
// ================================

document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);


async function startOnlineStatus(){

    const {
        data
    } =
    await supabaseClient.auth.getSession();


    if(
        !data.session
    ){

        return;

    }


    userId =
        data.session.user.id;


    // вошёл
    await updateOnline(true);



    // каждые 30 секунд обновляем время
    setInterval(
        async ()=>{

            if(userId){

                await updateOnline(true);

            }

        },
        30000
    );



    // выход из аккаунта
    supabaseClient.auth.onAuthStateChange(
        async(event)=>{


            if(
                event === "SIGNED_OUT"
            ){

                await updateOnline(false);

            }


        }
    );

}


// ================================
// UPDATE
// ================================

async function updateOnline(value){


    if(
        !userId
    ){

        return;

    }


    const {
        error
    } =
    await supabaseClient
        .from("profiles")
        .update({

            is_online:value,

            last_seen:
                new Date().toISOString()

        })
        .eq(
            "id",
            userId
        );



    if(error){

        console.error(
            "ONLINE ERROR",
            error
        );

    }


}