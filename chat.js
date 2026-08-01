/* =====================================================
   MEMORA CHAT JS
   PART 1 — CORE
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */


const supabaseUrl =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const supabaseKey =
    "ТВОЙ_ANON_KEY";


const supabaseClient =
    supabase.createClient(
        supabaseUrl,
        supabaseKey
    );



/* =====================================================
   GLOBAL STATE
===================================================== */


let currentUser =
    null;


let friends =
    [];


let notifications =
    [];


let activeFriend =
    null;


let activeConversationId =
    null;


let messageChannel =
    null;


let notificationChannel =
    null;



/* =====================================================
   DOM ELEMENTS
===================================================== */


const friendList =
    document.getElementById(
        "friendList"
    );


const friendCount =
    document.getElementById(
        "friendCount"
    );


const notificationList =
    document.getElementById(
        "notificationList"
    );


const notificationBadge =
    document.getElementById(
        "notificationBadge"
    );


const conversationView =
    document.getElementById(
        "conversationView"
    );


const friendsView =
    document.getElementById(
        "friendsView"
    );


const conversationName =
    document.getElementById(
        "conversationName"
    );


const conversationStatus =
    document.getElementById(
        "conversationStatus"
    );


const conversationAvatar =
    document.getElementById(
        "conversationAvatar"
    );


const messageList =
    document.getElementById(
        "messageList"
    );


const messageForm =
    document.getElementById(
        "messageForm"
    );


const messageInput =
    document.getElementById(
        "messageInput"
    );


const sendMessageButton =
    document.getElementById(
        "sendMessageButton"
    );


const conversationBack =
    document.getElementById(
        "conversationBack"
    );



/* =====================================================
   START APP
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    async function(){

        console.log(
            "Memora chat starting..."
        );


        await initChat();


    }
);



/* =====================================================
   INIT
===================================================== */


async function initChat(){


    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();



    if(error){

        console.error(
            error
        );

        return;

    }



    if(
        !data.session
    ){

        console.error(
            "No session"
        );

        return;

    }



    currentUser =
        data.session.user;



    console.log(
        "Current user:",
        currentUser.id
    );



    await loadFriends();


    await loadNotifications();


    subscribeToNotifications();


    setupConversation();


}
