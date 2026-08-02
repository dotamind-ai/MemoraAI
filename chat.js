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


let activeFriendId =
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
/* =====================================================
   NOTIFICATIONS
   PART 3
===================================================== */


async function loadNotifications(){


    try {


        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "notifications"
                )
                .select(
                    `
                    id,
                    user_id,
                    type,
                    title,
                    body,
                    related_id,
                    read,
                    created_at
                    `
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .eq(
                    "read",
                    false
                )
                .order(
                    "created_at",
                    {
                        ascending:false
                    }
                );



        if(error){

            throw error;

        }



        notifications =
            data || [];



        console.log(
            "Notifications loaded:",
            notifications
        );



        renderNotifications();



    }
    catch(error){


        console.error(
            "Notifications error:",
            error
        );


        notifications =
            [];


        renderNotifications();


    }


}







function renderNotifications(){


    if(
        notificationBadge
    ){

        notificationBadge.textContent =
            notifications.length;


        notificationBadge.hidden =
            notifications.length === 0;

    }




    if(
        !notificationList
    ){

        return;

    }



    notificationList.innerHTML =
        "";



    if(
        notifications.length === 0
    ){


        notificationList.innerHTML = `

            <div class="notification-empty">

                No notifications

            </div>

        `;


        return;

    }




    notifications.forEach(
    function(notification){


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "notification-card";



        let actions = "";



        if(
            notification.type === "friend_request"
        ){

            actions = `

                <div class="notification-actions">


                    <button
                        class="accept-friend-button"
                        data-request-id="${notification.related_id}"
                    >
                        Accept
                    </button>



                    <button
                        class="reject-friend-button"
                        data-request-id="${notification.related_id}"
                    >
                        Reject
                    </button>


                </div>

            `;

        }



        item.innerHTML = `

            <strong>
                ${notification.title || "Notification"}
            </strong>


            <span>
                ${notification.body || ""}
            </span>


            ${actions}

        `;



        notificationList.appendChild(
            item
        );


    }
);


            notificationList.appendChild(
                item
            );


        }
    );


}
/* =====================================================
   REALTIME NOTIFICATIONS
   PART 4
===================================================== */


function subscribeToNotifications(){


    if(
        !currentUser
    ){

        return;

    }



    if(
        notificationChannel
    ){

        supabaseClient.removeChannel(
            notificationChannel
        );

    }



    notificationChannel =
        supabaseClient
            .channel(
                "memora-notifications-" +
                currentUser.id
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "INSERT",

                    schema:
                        "public",

                    table:
                        "notifications",

                    filter:
                        "user_id=eq." +
                        currentUser.id

                },

                function(payload){


                    console.log(
                        "New notification:",
                        payload.new
                    );



                    notifications.unshift(
                        payload.new
                    );



                    renderNotifications();



                }

            )
            .subscribe(
                function(status){

                    console.log(
                        "Notification realtime:",
                        status
                    );

                }
            );


}





/* =====================================================
   TEMP CHAT OPEN
===================================================== */


async function openConversation(
    friend
){


    console.log(
        "Opening chat with:",
        friend
    );



    activeFriend =
        friend;



    if(
        conversationName
    ){

        conversationName.textContent =
            friend.display_name ||
            "Memora user";

    }



    if(
        friendsView
    ){

        friendsView.style.display =
            "none";

    }



    if(
        conversationView
    ){

        conversationView.style.display =
            "flex";

    }



    console.log(
        "Chat window opened"
    );


}
/* =====================================================
   CONVERSATION SETUP
   PART 5
===================================================== */


function setupConversation(){


    console.log(
        "Conversation setup"
    );



    if(
        conversationBack
    ){

        conversationBack.addEventListener(
            "click",
            function(){

                closeConversation();

            }
        );

    }




    if(
        messageForm
    ){

        messageForm.addEventListener(
            "submit",
            function(event){

                sendMessage(
                    event
                );

            }
        );

    }




    if(
        messageInput
    ){

        messageInput.addEventListener(
            "input",
            function(){

                autoResizeMessageInput();

            }
        );

    }



}





/* =====================================================
   CLOSE CHAT
===================================================== */


function closeConversation(){
   console.trace(
    "CLOSE CHAT CALLED"
);


    console.log(
        "Close conversation"
    );



    activeFriend =
        null;


    activeConversationId =
        null;



    if(
        conversationView
    ){

        conversationView.style.display =
            "none";

    }



    if(
        friendsView
    ){

        friendsView.style.display =
            "block";

    }



}
/* =====================================================
   OPEN CONVERSATION
   PART 6
===================================================== */


async function openConversation(friend){


    if(
        !friend ||
        !friend.friend_id
    ){

        console.error(
            "Invalid friend",
            friend
        );

        return;

    }



    console.log(
        "Opening conversation with:",
        friend
    );



    // сохраняем текущего собеседника

    activeFriend =
        friend;



    // сохраняем ID именно друга

    activeFriendId =
        friend.friend_id;



    console.log(
        "Active friend id:",
        activeFriendId
    );



    if(
        conversationName
    ){

        conversationName.textContent =
            friend.display_name ||
            "Memora user";

    }



    if(
        friendsView
    ){

        friendsView.style.display =
            "none";

    }



    if(
        conversationView
    ){

        conversationView.style.display =
            "flex";

    }



    console.log(
        "Chat window opened"
    );



    try{


        const {
            data,
            error
        }
        =
        await supabaseClient.rpc(
            "get_or_create_direct_chat",
            {

                other_user_id:
                    friend.friend_id

            }
        );



        if(error){

            throw error;

        }



        activeConversationId =
            data;



        console.log(
            "Conversation id:",
            activeConversationId
        );



        await loadMessages();



        subscribeToMessages();



    }
    catch(error){


        console.error(
            "Open conversation error:",
            error
        );


    }



}



/* =====================================================
   LOAD MESSAGES
===================================================== */


async function loadMessages(){


    if(
        !activeConversationId
    ){

        console.warn(
            "No conversation id"
        );

        return;

    }



    const {
        data,
        error
    } =
    await supabaseClient
        .from(
            "messages"
        )
        .select(
            "id,conversation_id,sender_id,content,created_at"
        )
        .eq(
            "conversation_id",
            activeConversationId
        )
        .order(
            "created_at",
            {
                ascending:true
            }
        );



    if(error){

        throw error;

    }



    console.log(
        "Messages loaded:",
        data
    );



    renderMessages(
        data || []
    );



}





/* =====================================================
   RENDER MESSAGES
===================================================== */


function renderMessages(messages){


    if(
        !messageList
    ){

        console.error(
            "messageList missing"
        );

        return;

    }



    messageList.innerHTML =
        "";



    if(
        messages.length === 0
    ){

        messageList.innerHTML = `

            <div class="messages-empty">

                <div class="empty-title">
                    No messages yet
                </div>

                <div class="empty-text">
                    Start conversation
                </div>

            </div>

        `;


        return;

    }




    messages.forEach(
        function(message){


            const row =
                document.createElement(
                    "div"
                );



            row.className =
                "message-bubble-row";



            if(
                message.sender_id ===
                currentUser.id
            ){

                row.classList.add(
                    "mine"
                );

            }



            const bubble =
                document.createElement(
                    "div"
                );



            bubble.className =
                "message-bubble";



            bubble.textContent =
                message.content;



            row.appendChild(
                bubble
            );



            messageList.appendChild(
                row
            );



        }
    );



    messageList.scrollTop =
        messageList.scrollHeight;


}
// =====================================================
// MESSAGE REALTIME
// =====================================================


function subscribeToMessages() {


    if (
        !activeConversationId
    ) {

        console.warn(
            "No active conversation"
        );

        return;

    }


    stopMessageRealtime();


    console.log(
        "Starting message realtime:",
        activeConversationId
    );


    messageChannel =
        supabaseClient
            .channel(
                "memora-messages-" +
                activeConversationId
            )
            .on(
                "postgres_changes",
                {

                    event:
                        "INSERT",

                    schema:
                        "public",

                    table:
                        "messages",

                    filter:
                        "conversation_id=eq." +
                        activeConversationId

                },

                function(payload) {


                    console.log(
                        "Realtime new message:",
                        payload.new
                    );


                    appendMessage(
                        payload.new
                    );


                    scrollMessagesToBottom();


                }

            )
            .subscribe(
                function(status) {


                    console.log(
                        "Message realtime:",
                        status
                    );


                }
            );


}





function stopMessageRealtime() {


    if (
        !messageChannel
    ) {

        return;

    }


    supabaseClient.removeChannel(
        messageChannel
    );


    messageChannel =
        null;


}
// =====================================================
// MESSAGE INPUT RESIZE
// =====================================================

function autoResizeMessageInput() {

    if (
        !messageInput
    ) {

        return;

    }


    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            125
        )
        +
        "px";

}
// =====================================================
// SEND MESSAGE
// =====================================================

async function sendMessage(event) {

    event.preventDefault();


    console.log(
        "SEND MESSAGE START"
    );


    if (
        !activeConversationId ||
        !messageInput
    ) {

        console.warn(
            "No active conversation"
        );

        return;

    }


    const content =
        messageInput.value.trim();


    if (!content) {

        return;

    }


    try {


        const {
            data,
            error
        } =
        await supabaseClient
            .from("messages")
            .insert({

                conversation_id:
                    activeConversationId,

                sender_id:
                    currentUser.id,

                content:
                    content

            })
            .select(
                "id,conversation_id,sender_id,content,created_at"
            )
            .single();



        if(error){

            throw error;

        }



        console.log(
            "Message sent:",
            data
        );


        messageInput.value =
            "";


        if(
            typeof autoResizeMessageInput === "function"
        ){

            autoResizeMessageInput();

        }


        appendMessage(
            data
        );


        scrollMessagesToBottom();



    } catch(error){


        console.error(
            "Send message error:",
            error
        );


    }

}
// =====================================================
// APPEND SINGLE MESSAGE
// =====================================================

function appendMessage(
    message
) {


    if(
        !messageList ||
        !message
    ){

        return;

    }



    if(
        document.querySelector(
            `[data-message-id="${message.id}"]`
        )
    ){

        return;

    }



    const row =
        document.createElement(
            "div"
        );



    row.className =
        "message-bubble-row";



    row.dataset.messageId =
        message.id;



    if(
        message.sender_id ===
        currentUser.id
    ){

        row.classList.add(
            "mine"
        );

    }



    const bubble =
        document.createElement(
            "div"
        );



    bubble.className =
        "message-bubble";



    const text =
        document.createElement(
            "div"
        );



    text.className =
        "message-text";



    text.textContent =
        message.content;



    const time =
        document.createElement(
            "div"
        );



    time.className =
        "message-time";



    time.textContent =
        formatTime(
            message.created_at
        );



    bubble.appendChild(
        text
    );


    bubble.appendChild(
        time
    );



    row.appendChild(
        bubble
    );



    messageList.appendChild(
        row
    );

}
// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(
    dateString
) {


    if(
        !dateString
    ){

        return "";

    }


    return new Date(
        dateString
    )
    .toLocaleTimeString(
        "ru-RU",
        {
            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}
// =====================================================
// SCROLL MESSAGES TO BOTTOM
// =====================================================

function scrollMessagesToBottom() {

    if(
        !messageList
    ){

        return;

    }


    requestAnimationFrame(
        function(){

            messageList.scrollTop =
                messageList.scrollHeight;

        }
    );

}
// ======================================
// PROFILE BUTTON
// ======================================

const profileButton =
    document.getElementById("profileButton");

if (profileButton) {

    profileButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "profile.html";

        }
    );

}
// ======================================
// BOTTOM NAVIGATION
// ======================================


const homeNav =
    document.getElementById("homeNav");


const calendarNav =
    document.getElementById("calendarNav");


const eventsNav =
    document.getElementById("timelineNav");


const profileNav =
    document.getElementById("profileNav");



// Memories

if(homeNav){

    homeNav.onclick = function(){

        window.location.href =
            "index.html";

    };

}



// Calendar

if(calendarNav){

    calendarNav.onclick = function(){

        window.location.href =
            "calendar.html";

    };

}



// Events

if(eventsNav){

    eventsNav.onclick = function(){

        window.location.href =
            "events.html";

    };

}



// Profile

if(profileNav){

    profileNav.onclick = function(){

        cation.href =
            "profile.html";

    };

}
// ======================================
// NOTIFICATION PANEL UI
// ======================================


const notificationButton =
    document.getElementById(
        "notificationButton"
    );


const notificationPanel =
    document.getElementById(
        "notificationPanel"
    );


const closeNotificationPanel =
    document.getElementById(
        "closeNotificationPanel"
    );



if(notificationButton){

    notificationButton.addEventListener(
        "click",
        ()=>{


            if(notificationPanel.hidden){

                notificationPanel.hidden = false;

                console.log(
                    "Notifications opened"
                );


            }else{

                notificationPanel.hidden = true;

            }


        }
    );

}



if(closeNotificationPanel){

    closeNotificationPanel.addEventListener(
        "click",
        ()=>{

            notificationPanel.hidden = true;

        }
    );

}
// ======================================
// CLEAR NOTIFICATIONS BUTTON
// ======================================


const clearBtn =
    document.getElementById(
        "clearNotificationsButton"
    );


if(clearBtn){

    clearBtn.addEventListener(
        "click",
        async ()=>{


            console.log(
                "Clear notifications clicked"
            );


            if(
                !currentUser
            ){

                console.error(
                    "No current user"
                );

                return;

            }



            const { error } =
                await supabaseClient
                    .from(
                        "notifications"
                    )
                    .delete()
                    .eq(
                        "user_id",
                        currentUser.id
                    );



            if(error){

                console.error(
                    "Clear notifications error:",
                    error
                );

                return;

            }



            console.log(
                "Notifications deleted from database"
            );



            const list =
                document.getElementById(
                    "notificationList"
                );


            if(list){

                list.innerHTML = "";

            }



            const badge =
                document.getElementById(
                    "notificationBadge"
                );


            if(badge){

                badge.hidden = true;

                badge.textContent = "0";

            }



            if(
                typeof notifications !== "undefined"
            ){

                notifications.length = 0;

            }


        }
    );

}
// ======================================
// ADD FRIEND PANEL
// ======================================


const addFriendBtn =
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



if(addFriendBtn){

    addFriendBtn.addEventListener(
        "click",
        ()=>{


            console.log(
                "Add friend opened"
            );


            if(addFriendPanel){

                addFriendPanel.hidden = false;

            }


        }
    );

}



if(closeAddFriendPanel){

    closeAddFriendPanel.addEventListener(
        "click",
        ()=>{


            if(addFriendPanel){

                addFriendPanel.hidden = true;

            }


        }
    );

}
/* =====================================================
   ADD FRIEND SEARCH
===================================================== */


/* =====================================================
   ADD FRIEND SEARCH
===================================================== */


const addFriendSearchButton =
    document.getElementById(
        "searchButton"
    );


const addFriendInput =
    document.getElementById(
        "emailSearch"
    );


const addFriendResult =
    document.getElementById(
        "searchResult"
    );


const addFriendMessage =
    document.getElementById(
        "searchMessage"
    );





/* =====================================================
   CHECK FRIEND STATUS
===================================================== */


async function checkFriendStatus(
    friendId
){


    const {
        data,
        error
    }
    =
    await supabaseClient
        .from(
            "friendships"
        )
        .select(
            "id,status,requester_id,addressee_id"
        )
        .or(
            `and(requester_id.eq.${currentUser.id},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${currentUser.id})`
        );



    if(error){

        console.error(
            "Friend status error:",
            error
        );

        return null;

    }



    const accepted =
        data.find(
            item =>
                item.status === "accepted"
        );



    if(accepted){

        return "accepted";

    }



    const pending =
        data.find(
            item =>
                item.status === "pending"
        );



    if(pending){

        return "pending";

    }



    return null;


}






/* =====================================================
   FRIEND SEARCH
===================================================== */


if(addFriendSearchButton){


    addFriendSearchButton.addEventListener(
        "click",
        async ()=>{


            const nickname =
                addFriendInput.value
                    .trim();



            if(!nickname){


                addFriendMessage.textContent =
                    "Enter username";


                return;

            }



            console.log(
                "Friend search:",
                nickname
            );



            addFriendMessage.textContent =
                "Searching...";



            addFriendResult.innerHTML =
                "";



            const {
                data,
                error
            }
            =
            await supabaseClient
                .from(
                    "profiles"
                )
                .select(
                    `
                    id,
                    display_name,
                    avatar_url,
                    is_online
                    `
                )
                .ilike(
                    "display_name",
                    `%${nickname}%`
                )
                .neq(
                    "id",
                    currentUser.id
                );



            if(error){


                console.error(
                    "Search error:",
                    error
                );


                addFriendMessage.textContent =
                    "Search error";


                return;

            }



            console.log(
                "Found users:",
                data
            );



            if(
                !data ||
                data.length === 0
            ){


                addFriendMessage.textContent =
                    "No users found";


                return;

            }



            addFriendMessage.textContent =
                "";





            for(
                const user of data
            ){


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "found-user";



                const relation =
                    await checkFriendStatus(
                        user.id
                    );



                let friendButtonText =
                    "Add friend";


                let friendButtonDisabled =
                    "";



                if(
                    relation === "accepted"
                ){

                    friendButtonText =
                        "Friends ✓";


                    friendButtonDisabled =
                        "disabled";

                }
                else if(
                    relation === "pending"
                ){

                    friendButtonText =
                        "Request sent";


                    friendButtonDisabled =
                        "disabled";

                }




                card.innerHTML = `


                    <div class="found-avatar">


                        ${
                            user.avatar_url
                            ?
                            `<img src="${user.avatar_url}">`
                            :
                            "M"
                        }


                    </div>



                    <div class="found-info">


                        <strong>

                            ${
                                user.display_name
                                ||
                                "User"
                            }

                        </strong>



                        <span>

                            ${
                                user.is_online
                                ?
                                "Online"
                                :
                                "Offline"
                            }

                        </span>




                        <button

                            class="add-friend-request"

                            data-user-id="${user.id}"

                            type="button"

                            ${friendButtonDisabled}

                        >

                            ${friendButtonText}

                        </button>



                    </div>


                `;



                addFriendResult.appendChild(
                    card
                );


            }



        }

    );


}







/* =====================================================
   SEND FRIEND REQUEST
===================================================== */


document.addEventListener(
    "click",
    async function(e){



        const button =
            e.target.closest(
                ".add-friend-request"
            );



        if(!button){

            return;

        }



        if(!currentUser){

            console.error(
                "Current user not loaded"
            );

            return;

        }




        const friendId =
            button.dataset.userId;



        console.log(
            "Send friend request:",
            friendId
        );





        const relation =
            await checkFriendStatus(
                friendId
            );



        if(
            relation === "accepted"
        ){


            button.textContent =
                "Friends ✓";


            button.disabled =
                true;


            return;

        }



        if(
            relation === "pending"
        ){


            button.textContent =
                "Request sent";


            button.disabled =
                true;


            return;

        }






        const {
            data,
            error
        }
        =
        await supabaseClient
            .from(
                "friendships"
            )
            .insert({

                requester_id:
                    currentUser.id,


                addressee_id:
                    friendId,


                status:
                    "pending"

            })
            .select()
            .single();





        if(error){


            console.error(
                "Friend request error:",
                error
            );


            return;

        }




        console.log(
            "Friend request created:",
            data
        );






        const {
            error:
            notificationError
        }
        =
        await supabaseClient
            .from(
                "notifications"
            )
            .insert({

                user_id:
                    friendId,


                type:
                    "friend_request",


                title:
                    "New friend request",


                body:
                    currentUser.display_name +
                    " wants to add you",


                related_id:
                    data.id,


                read:
                    false

            });






        if(notificationError){


            console.error(
                "Notification create error:",
                notificationError
            );


        }
        else{


            console.log(
                "Friend request notification created"
            );


        }





        button.textContent =
            "Request sent";


        button.disabled =
            true;



    }
);
/* =====================================================
   OPEN FRIEND PROFILE FROM CHAT
===================================================== */


const friendProfileButton =
    document.getElementById(
        "friendProfileButton"
    );


if(friendProfileButton){


    friendProfileButton.addEventListener(
        "click",
        ()=>{


            if(!activeFriend){

                console.error(
                    "No active friend"
                );

                return;

            }



            console.log(
                "Open profile:",
                activeFriend.id
            );



           window.location.href =
    "profile.html?user=" +
    activeFriend.friend_id;


        }
    );


}
