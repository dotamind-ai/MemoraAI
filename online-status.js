console.log("online status loaded");


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



async function startOnlineStatus() {


    console.log("checking session");


    const {
        data,
        error
    } =
    await supabaseClient.auth.getSession();



    console.log(
        "session:",
        data.session
    );


    if (
        error ||
        !data.session
    ) {

        console.log(
            "no user"
        );

        return;

    }



    userId =
    data.session.user.id;



    console.log(
        "USER ID:",
        userId
    );



    await setOnline(true);



}



async function setOnline(value) {


    console.log(
        "setting online:",
        value
    );


    const {
        error
    } =
    await supabaseClient
    .from("profiles")
    .update({

        is_online:value,

        last_seen:
        new Date()

    })
    .eq(
        "id",
        userId
    );


    console.log(
        "UPDATE RESULT:",
        error
    );


}



document.addEventListener(
"DOMContentLoaded",
startOnlineStatus
);