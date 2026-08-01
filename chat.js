/* =====================================================
   MEMORA CHAT JS
   PART 1 — CORE
===================================================== */



/* =====================================================
   SUPABASE
===================================================== */

// supabaseClient уже создан в отдельном файле
// НЕ СОЗДАВАТЬ ЕГО ЗДЕСЬ



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


const friendsView =
    document.getElementById(
        "friendsView"
    );


const conversationView =
    document.getElementById(
        "conversationView"
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
   START
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){

        console.log(
            "Memora chat loaded"
        );


        initChat();

    }
);



/* =====================================================
   INIT CHAT
===================================================== */


async function initChat(){


    try {


        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();



        if(error){

            throw error;

        }



        if(
            !data.session
        ){

            console.error(
                "User is not logged in"
            );

            return;

        }



        currentUser =
            data.session.user;



        console.log(
            "Logged user:",
            currentUser.id
        );



        await loadFriends();



        await loadNotifications();



        subscribeToNotifications();



        setupConversation();



    }
    catch(error){


        console.error(
            "Chat init error:",
            error
        );


    }


}
