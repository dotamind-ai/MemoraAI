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
/* =====================================================
   FRIENDS
   PART 2
===================================================== */



async function loadFriends(){


    try {


        const {
            data,
            error
        } =
            await supabaseClient.rpc(
                "get_my_friends"
            );



        if(error){

            throw error;

        }



        friends =
            data || [];



        console.log(
            "Friends loaded:",
            friends
        );



        renderFriends();


    }
    catch(error){


        console.error(
            "Load friends error:",
            error
        );


        friends =
            [];


        renderFriends();


    }


}





function renderFriends(){


    if(
        !friendList
    ){

        console.warn(
            "friendList element not found"
        );

        return;

    }



    friendList.innerHTML =
        "";



    if(friendCount){

        friendCount.textContent =
            friends.length;

    }



    if(
        friends.length === 0
    ){


        friendList.innerHTML = `

            <div class="empty-state">

                No friends yet.

            </div>

        `;


        return;


    }





    friends.forEach(
        function(friend){



            const card =
                document.createElement(
                    "div"
                );



            card.className =
                "person-card";





            const avatar =
                document.createElement(
                    "div"
                );



            avatar.className =
                "person-avatar";



            avatar.textContent =
                getInitial(
                    friend.display_name
                );





            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "person-info";





            const name =
                document.createElement(
                    "div"
                );



            name.className =
                "person-name";



            name.textContent =
                friend.display_name ||
                "Memora user";





            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "person-email";



            status.textContent =
                friend.is_online
                    ? "Online"
                    : "Offline";





            info.appendChild(
                name
            );


            info.appendChild(
                status
            );





            const button =
                document.createElement(
                    "button"
                );



            button.type =
                "button";



            button.className =
                "person-action primary";



            button.textContent =
                "Chat";



            button.onclick =
                function(){


                    openConversation(
                        friend
                    );


                };





            card.appendChild(
                avatar
            );


            card.appendChild(
                info
            );


            card.appendChild(
                button
            );



            friendList.appendChild(
                card
            );



        }
    );


}





function getInitial(
    name
){


    return (
        String(
            name ||
            "M"
        )
        .trim()
        .charAt(0)
        .toUpperCase()
        ||
        "M"
    );


}
