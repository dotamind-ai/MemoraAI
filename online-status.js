// ============================================
// MEMORA ONLINE STATUS TEST
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



let userId = null;



// ============================================
// START
// ============================================


document.addEventListener(
    "DOMContentLoaded",
    startOnlineStatus
);



async function startOnlineStatus() {


    alert("ONLINE SCRIPT START");



    const {
        data,
        error
    } =
    await supabaseClient.auth.getSession();



    if (error) {

        alert(
            "SESSION ERROR"
        );

        return;

    }



    if (
        !data.session
    ) {

        alert(
            "NO USER SESSION"
        );

        return;

    }



    userId =
        data.session.user.id;



    alert(
        "USER ID: " + userId
    );



    await setOnline();



}



// ============================================
// SET ONLINE
// ============================================


async function setOnline() {


    if (!userId) {

        return;

    }



    const {
        error
    } =
    await supabaseClient

        .from("profiles")

        .update({

            is_online: true,

            last_seen:
                new Date()
                .toISOString()

        })

        .eq(
            "id",
            userId
        );



    if (error) {


        alert(
            "UPDATE ERROR: " +
            error.message
        );


        return;

    }



    alert(
        "ONLINE TRUE SAVED"
    );


}