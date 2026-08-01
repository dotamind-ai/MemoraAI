// =====================================================
// MEMORA CHAT
// PART 1 / 5
// Core + Auth + DOM + State + Panels + Navigation
// =====================================================


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );



// =====================================================
// DOM ELEMENTS
// =====================================================


const emailSearch =
    document.getElementById(
        "emailSearch"
    );


const searchButton =
    document.getElementById(
        "searchButton"
    );


const searchMessage =
    document.getElementById(
        "searchMessage"
    );


const searchResult =
    document.getElementById(
        "searchResult"
    );



const notificationButton =
    document.getElementById(
        "notificationButton"
    );


const notificationBadge =
    document.getElementById(
        "notificationBadge"
    );


const notificationPanel =
    document.getElementById(
        "notificationPanel"
    );


const notificationList =
    document.getElementById(
        "notificationList"
    );


const closeNotificationPanel =
    document.getElementById(
        "closeNotificationPanel"
    );


const clearNotificationsButton =
    document.getElementById(
        "clearNotificationsButton"
    );



const addFriendButton =
    document.getElementById(
        "addFriendButton"
    );


const addFriendPanel =
    document.getElementById(
        "addFriendPanel"
    );


const closeAddFriendPanel =
    document.getElementById(
        "closeAddFriendPanel"
    );



const friendList =
    document.getElementById(
        "friendList"
    );


const friendCount =
    document.getElementById(
        "friendCount"
    );



const chatSearchInput =
    document.getElementById(
        "chatSearchInput"
    );



const profileButton =
    document.getElementById(
        "profileButton"
    );



const myAvatar =
    document.getElementById(
        "myAvatar"
    );



const friendsView =
    document.getElementById(
        "friendsView"
    );


const conversationView =
    document.getElementById(
        "conversationView"
    );


const conversationBack =
    document.getElementById(
        "conversationBack"
    );


const conversationAvatar =
    document.getElementById(
        "conversationAvatar"
    );


const conversationName =
    document.getElementById(
        "conversationName"
    );


const conversationStatus =
    document.getElementById(
        "conversationStatus"
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



const homeNav =
    document.getElementById(
        "homeNav"
    );


const calendarNav =
    document.getElementById(
        "calendarNav"
    );


const timelineNav =
    document.getElementById(
        "timelineNav"
    );




// =====================================================
// STATE
// =====================================================


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


let friendStatusChannel =
    null;


let currentChatSearch =
    "";




// =====================================================
// START
// =====================================================


document.addEventListener(
    "DOMContentLoaded",
    initChat
);



async function initChat(){


    try{


        const {
            data,
            error
        } =
        await supabaseClient.auth.getSession();



        if(error){

            console.error(
                "Session error",
                error
            );

            return;

        }



        if(
            !data.session
        ){

            window.location.href =
                "welcome/welcome.html";

            return;

        }



        currentUser =
            data.session.user;



        setupNavigation();


        setupPanels();



        console.log(
            "MEMORA CHAT READY",
            currentUser.email
        );



        // Следующие части добавят:
        // load profile
        // friends
        // notifications
        // messages


    }
    catch(error){


        console.error(
            "CHAT INIT ERROR",
            error
        );


    }


}



// =====================================================
// NAVIGATION
// =====================================================


function setupNavigation(){



    if(profileButton){


        profileButton.addEventListener(
            "click",
            function(){


                window.location.href =
                    "profile.html";


            }
        );


    }



    if(homeNav){


        homeNav.addEventListener(
            "click",
            function(){


                window.location.href =
                    "index.html";


            }
        );


    }



    if(calendarNav){


        calendarNav.addEventListener(
            "click",
            function(){


                window.location.href =
                    "calendar.html";


            }
        );


    }



    if(timelineNav){


        timelineNav.addEventListener(
            "click",
            function(){


                window.location.href =
                    "events.html";


            }
        );


    }




    supabaseClient.auth.onAuthStateChange(
        function(
            event
        ){


            if(
                event ===
                "SIGNED_OUT"
            ){


                window.location.href =
                    "welcome/welcome.html";


            }


        }
    );

}



// =====================================================
// PANELS
// =====================================================


function setupPanels(){



    if(
        addFriendButton &&
        addFriendPanel
    ){


        addFriendButton.addEventListener(
            "click",
            function(event){


                event.stopPropagation();


                closeNotifications();



                addFriendPanel.hidden =
                    !addFriendPanel.hidden;


            }
        );


    }



    if(closeAddFriendPanel){


        closeAddFriendPanel.addEventListener(
            "click",
            closeAddFriend
        );


    }




    if(
        notificationButton &&
        notificationPanel
    ){


        notificationButton.addEventListener(
            "click",
            function(event){


                event.stopPropagation();


                closeAddFriend();



                notificationPanel.hidden =
                    !notificationPanel.hidden;



            }
        );


    }



    if(closeNotificationPanel){


        closeNotificationPanel.addEventListener(
            "click",
            closeNotifications
        );


    }



    if(clearNotificationsButton){


        clearNotificationsButton.addEventListener(
            "click",
            clearAllNotifications
        );


    }



    document.addEventListener(
        "click",
        function(event){


            if(
                notificationPanel &&
                !notificationPanel.hidden &&
                !notificationPanel.contains(
                    event.target
                ) &&
                !notificationButton.contains(
                    event.target
                )
            ){


                closeNotifications();


            }



            if(
                addFriendPanel &&
                !addFriendPanel.hidden &&
                !addFriendPanel.contains(
                    event.target
                ) &&
                !addFriendButton.contains(
                    event.target
                )
            ){


                closeAddFriend();


            }



        }
    );


}




function closeNotifications(){


    if(notificationPanel){

        notificationPanel.hidden =
            true;

    }


}



function closeAddFriend(){


    if(addFriendPanel){

        addFriendPanel.hidden =
            true;

    }


}




// Заглушка.
// Полностью заполнится в части 3.

async function clearAllNotifications(){


    console.log(
        "clear notifications"
    );


}