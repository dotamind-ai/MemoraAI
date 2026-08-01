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
// =====================================================
// PART 2 / 5
// Profile + Search + Friends
// =====================================================


// =====================================================
// PROFILE
// =====================================================


async function loadMyProfile(){


    if(!currentUser){

        return;

    }


    const {
        data,
        error
    } =
    await supabaseClient
        .from("profiles")
        .select(
            `
            id,
            display_name,
            avatar_url,
            is_online,
            last_seen
            `
        )
        .eq(
            "id",
            currentUser.id
        )
        .maybeSingle();



    if(error){

        console.error(
            "PROFILE ERROR",
            error
        );


        setMyAvatar(
            currentUser.email,
            null
        );


        return;

    }



    setMyAvatar(
        data?.display_name ||
        currentUser.email,

        data?.avatar_url ||
        null
    );


}




function setMyAvatar(
    name,
    avatarUrl
){


    if(!myAvatar){

        return;

    }



    if(avatarUrl){


        myAvatar.style.backgroundImage =
            `url("${avatarUrl}")`;


        myAvatar.textContent =
            "";


        return;

    }



    myAvatar.style.backgroundImage =
        "";



    myAvatar.textContent =
        getInitial(
            name
        );


}




// =====================================================
// SEARCH
// =====================================================


function setupSearch(){



    if(
        searchButton &&
        emailSearch
    ){


        searchButton.addEventListener(
            "click",
            searchUser
        );



        emailSearch.addEventListener(
            "keydown",
            function(event){


                if(
                    event.key ===
                    "Enter"
                ){

                    event.preventDefault();

                    searchUser();

                }


            }
        );


    }



    if(chatSearchInput){


        chatSearchInput.addEventListener(
            "input",
            function(){


                currentChatSearch =
                    chatSearchInput.value
                    .trim()
                    .toLowerCase();



                renderFriends();


            }
        );


    }


}




async function searchUser(){



    if(
        !emailSearch
    ){

        return;

    }



    const email =
        emailSearch.value
        .trim();



    if(searchResult){

        searchResult.innerHTML =
            "";

    }



    if(searchMessage){

        searchMessage.textContent =
            "";

    }



    if(!email){


        if(searchMessage){

            searchMessage.textContent =
                "Введите email";

        }


        return;

    }




    searchButton.disabled =
        true;


    searchButton.textContent =
        "...";



    try{


        const {
            data,
            error
        } =
        await supabaseClient.rpc(
            "find_user_by_email",
            {
                search_email:
                    email
            }
        );



        if(error){

            throw error;

        }



        if(
            !data ||
            data.length === 0
        ){


            searchMessage.textContent =
                "Пользователь не найден";


            return;

        }



        renderSearchResult(
            data[0],
            email
        );



    }
    catch(error){


        console.error(
            "SEARCH ERROR",
            error
        );


        searchMessage.textContent =
            error.message ||
            "Ошибка поиска";


    }
    finally{


        searchButton.disabled =
            false;


        searchButton.textContent =
            "Find";


    }



}




function renderSearchResult(
    user,
    email
){



    if(!searchResult){

        return;

    }



    const card =
        document.createElement(
            "div"
        );


    card.className =
        "person-card";



    const avatar =
        createPersonAvatar(
            user.display_name,
            user.avatar_url
        );



    const info =
        document.createElement(
            "div"
        );


    info.className =
        "person-info";



    const name =
        document.createElement(
            "span"
        );


    name.className =
        "person-name";


    name.textContent =
        user.display_name ||
        "Memora user";



    const mail =
        document.createElement(
            "span"
        );


    mail.className =
        "person-email";


    mail.textContent =
        email;



    info.appendChild(
        name
    );


    info.appendChild(
        mail
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
        "Add";



    button.onclick =
        function(){

            sendFriendRequest(
                user.id,
                button
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



    searchResult.appendChild(
        card
    );



}





// =====================================================
// FRIEND REQUEST
// =====================================================


async function sendFriendRequest(
    userId,
    button
){



    button.disabled =
        true;


    button.textContent =
        "...";



    try{


        const {
            error
        } =
        await supabaseClient.rpc(
            "send_friend_request",
            {
                target_user_id:
                    userId
            }
        );



        if(error){

            throw error;

        }



        button.textContent =
            "Sent";



    }
    catch(error){


        console.error(
            "REQUEST ERROR",
            error
        );



        button.disabled =
            false;


        button.textContent =
            "Add";


    }



}






// =====================================================
// FRIENDS
// =====================================================


async function loadFriends(){



    const {
        data,
        error
    } =
    await supabaseClient.rpc(
        "get_my_friends"
    );



    if(error){


        console.error(
            "FRIENDS ERROR",
            error
        );


        friends =
            [];


        renderFriends();


        return;

    }



    friends =
        data || [];



    renderFriends();



}




function renderFriends(){



    if(!friendList){

        return;

    }



    friendList.innerHTML =
        "";



    let list =
        friends;



    if(currentChatSearch){


        list =
            friends.filter(
                function(friend){


                    return (
                        friend.display_name ||
                        ""
                    )
                    .toLowerCase()
                    .includes(
                        currentChatSearch
                    );


                }
            );


    }





    if(friendCount){

        friendCount.textContent =
            friends.length;

    }




    if(!list.length){


        friendList.innerHTML = `

            <div class="empty-state">

                No friends yet

            </div>

        `;


        return;

    }




    list.forEach(
        function(friend){



            const card =
                document.createElement(
                    "div"
                );



            card.className =
                "person-card";



            const avatar =
                createPersonAvatar(
                    friend.display_name,
                    friend.avatar_url
                );



            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "person-info";



            const name =
                document.createElement(
                    "span"
                );



            name.className =
                "person-name";



            name.textContent =
                friend.display_name ||
                "Memora user";



            const status =
                document.createElement(
                    "span"
                );


            status.className =
                "person-email";



            status.textContent =
                friend.is_online
                ? "🟢 Online"
                : "⚫ Offline";



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
// =====================================================
// PART 3 / 5
// Notifications + Realtime
// =====================================================


// =====================================================
// LOAD NOTIFICATIONS
// =====================================================


async function loadNotifications(){


    if(!currentUser){

        return;

    }


    const {
        data,
        error
    } =
    await supabaseClient
        .from("notifications")
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

        console.error(
            "NOTIFICATIONS ERROR",
            error
        );


        notifications = [];

        renderNotifications();


        return;

    }



    notifications =
        data || [];



    renderNotifications();

    renderFriends();


}




// =====================================================
// RENDER NOTIFICATIONS
// =====================================================


function renderNotifications(){


    if(
        !notificationList ||
        !notificationBadge
    ){

        return;

    }



    notificationBadge.textContent =
        notifications.length;



    notificationBadge.hidden =
        notifications.length === 0;



    notificationList.innerHTML =
        "";




    if(!notifications.length){


        notificationList.innerHTML = `

            <div class="notification-empty">

                Нет уведомлений

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



            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                notification.title ||
                "Notification";



            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                notification.body ||
                "";



            item.appendChild(
                title
            );


            item.appendChild(
                text
            );




            if(
                notification.type ===
                "friend_request"
            ){


                createFriendActions(
                    item,
                    notification
                );


            }
            else{


                item.onclick =
                    function(){

                        openMessageNotification(
                            notification
                        );

                    };


            }



            notificationList.appendChild(
                item
            );


        }
    );


}






// =====================================================
// FRIEND REQUEST ACTIONS
// =====================================================


function createFriendActions(
    item,
    notification
){


    const box =
        document.createElement(
            "div"
        );


    box.className =
        "notification-actions";



    const accept =
        document.createElement(
            "button"
        );


    accept.textContent =
        "Accept";


    accept.className =
        "notification-action accept";



    accept.onclick =
        async function(event){


            event.stopPropagation();


            await answerFriendRequest(
                notification,
                true
            );


        };





    const reject =
        document.createElement(
            "button"
        );


    reject.textContent =
        "Reject";


    reject.className =
        "notification-action";



    reject.onclick =
        async function(event){


            event.stopPropagation();


            await answerFriendRequest(
                notification,
                false
            );


        };




    box.appendChild(
        accept
    );


    box.appendChild(
        reject
    );



    item.appendChild(
        box
    );


}





async function answerFriendRequest(
    notification,
    accepted
){


    const rpc =
        accepted
        ? "accept_friend_request"
        : "reject_friend_request";



    const {
        error
    } =
    await supabaseClient.rpc(
        rpc,
        {
            request_id:
                notification.related_id
        }
    );



    if(error){

        console.error(
            "REQUEST ANSWER ERROR",
            error
        );


        return;

    }



    await markNotificationRead(
        notification.id
    );



    await loadFriends();


}





// =====================================================
// MARK READ
// =====================================================


async function markNotificationRead(
    notificationId
){


    const {
        error
    } =
    await supabaseClient
        .from("notifications")
        .update(
            {
                read:true
            }
        )
        .eq(
            "id",
            notificationId
        )
        .eq(
            "user_id",
            currentUser.id
        );



    if(error){

        console.error(
            error
        );


        return;

    }



    notifications =
        notifications.filter(
            function(item){

                return (
                    item.id !==
                    notificationId
                );

            }
        );



    renderNotifications();

    renderFriends();


}





// =====================================================
// CLEAR ALL
// =====================================================


async function clearAllNotifications(){



    if(!currentUser){

        return;

    }



    const {
        error
    } =
    await supabaseClient
        .from("notifications")
        .update(
            {
                read:true
            }
        )
        .eq(
            "user_id",
            currentUser.id
        )
        .eq(
            "read",
            false
        );



    if(error){

        console.error(
            error
        );


        return;

    }



    notifications =
        [];


    renderNotifications();

    renderFriends();


}





// =====================================================
// OPEN MESSAGE FROM NOTIFICATION
// =====================================================


async function openMessageNotification(
    notification
){


    if(
        !notification.related_id
    ){

        return;

    }



    await markNotificationRead(
        notification.id
    );



    closeNotifications();



    const friend =
        friends.find(
            function(item){

                return (
                    item.conversation_id ===
                    notification.related_id
                );

            }
        );



    if(friend){

        openConversation(
            friend
        );

    }


}







// =====================================================
// REALTIME NOTIFICATIONS
// =====================================================


function subscribeToNotifications(){


    if(!currentUser){

        return;

    }



    if(notificationChannel){


        supabaseClient.removeChannel(
            notificationChannel
        );


    }





    notificationChannel =
        supabaseClient
            .channel(
                "notifications-" +
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



                    const notification =
                        payload.new;



                    notifications.unshift(
                        notification
                    );



                    renderNotifications();


                    renderFriends();




                    if(
                        notification.type ===
                        "new_message"
                    ){

                        showMessageToast(
                            notification
                        );


                    }



                }

            )

            .subscribe();



}
// =====================================================
// PART 4 / 5
// CONVERSATIONS + MESSAGES
// =====================================================


// =====================================================
// SETUP CHAT EVENTS
// =====================================================


function setupConversation(){


    if(conversationBack){

        conversationBack.addEventListener(
            "click",
            closeConversation
        );

    }




    if(messageForm){

        messageForm.addEventListener(
            "submit",
            sendMessage
        );

    }




    if(messageInput){

        messageInput.addEventListener(
            "input",
            autoResizeMessageInput
        );

    }


}






// =====================================================
// OPEN CONVERSATION
// =====================================================


async function openConversation(
    friend
){



    if(
        !friend ||
        !friend.friend_id
    ){

        console.error(
            "Friend data missing"
        );


        return;

    }




    activeFriend =
        friend;




    if(conversationName){

        conversationName.textContent =
            friend.display_name ||
            "Memora user";

    }




    if(conversationStatus){

        conversationStatus.textContent =
            "Private chat";

    }




    setConversationAvatar(
        friend.display_name,
        friend.avatar_url
    );





    if(friendsView){

        friendsView.style.display =
            "none";

    }




    if(conversationView){

        conversationView.style.display =
            "flex";

    }






    setMessagesLoading();





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
            "Conversation:",
            activeConversationId
        );





        await loadMessages();



        subscribeToMessages();



    }
    catch(error){


        console.error(
            "OPEN CHAT ERROR",
            error
        );



        if(messageList){

            messageList.innerHTML = `

                <div class="messages-empty">

                    ${escapeHtml(
                        error.message
                    )}

                </div>

            `;

        }


    }



}







// =====================================================
// CLOSE CHAT
// =====================================================


function closeConversation(){



    stopMessageRealtime();



    activeFriend =
        null;



    activeConversationId =
        null;




    if(conversationView){

        conversationView.style.display =
            "none";

    }





    if(friendsView){

        friendsView.style.display =
            "block";

    }



    if(messageList){

        messageList.innerHTML =
            "";

    }



}








// =====================================================
// LOAD MESSAGES
// =====================================================


async function loadMessages(){



    if(
        !activeConversationId
    ){

        return;

    }



    const {
        data,
        error
    }
    =
    await supabaseClient
        .from("messages")
        .select(
            `
            id,
            conversation_id,
            sender_id,
            content,
            created_at
            `
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




    renderMessages(
        data || []
    );


}







// =====================================================
// RENDER MESSAGES
// =====================================================


function renderMessages(
    messages
){



    if(!messageList){

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
                    No messages
                </div>

                <div class="empty-text">
                    Start conversation
                </div>

            </div>

        `;


        return;

    }





    messages.forEach(
        appendMessage
    );



    scrollMessagesToBottom();


}









function appendMessage(
    message
){



    if(!messageList){

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
        "message-row";



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
// SEND MESSAGE
// =====================================================


async function sendMessage(
    event
){



    event.preventDefault();





    if(
        !activeConversationId ||
        !messageInput
    ){

        return;

    }





    const text =
        messageInput.value.trim();




    if(!text){

        return;

    }





    sendMessageButton.disabled =
        true;






    try{


        const {
            data,
            error
        }
        =
        await supabaseClient
            .from("messages")
            .insert(
                {

                    conversation_id:
                        activeConversationId,


                    sender_id:
                        currentUser.id,


                    content:
                        text

                }
            )
            .select()
            .single();




        if(error){

            throw error;

        }





        messageInput.value =
            "";



        autoResizeMessageInput();



        appendMessage(
            data
        );



        scrollMessagesToBottom();



    }
    catch(error){


        console.error(
            "SEND MESSAGE ERROR",
            error
        );



        alert(
            error.message
        );


    }
    finally{


        sendMessageButton.disabled =
            false;


    }



}








// =====================================================
// REALTIME MESSAGES
// =====================================================


function subscribeToMessages(){



    stopMessageRealtime();





    if(!activeConversationId){

        return;

    }






    messageChannel =
        supabaseClient
            .channel(
                "messages-" +
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
                        "conversation_id=eq."+
                        activeConversationId

                },


                function(payload){


                    appendMessage(
                        payload.new
                    );



                    scrollMessagesToBottom();



                }

            )

            .subscribe();




}







function stopMessageRealtime(){



    if(!messageChannel){

        return;

    }



    supabaseClient.removeChannel(
        messageChannel
    );



    messageChannel =
        null;


}
// =====================================================
// PART 5 / 5
// HELPERS + AVATARS + STATUS + TOAST
// =====================================================


// =====================================================
// FRIEND ONLINE REALTIME
// =====================================================


function subscribeToFriendStatus(){


    supabaseClient
        .channel(
            "friends-status"
        )

        .on(
            "postgres_changes",
            {

                event:
                    "UPDATE",

                schema:
                    "public",

                table:
                    "profiles"

            },


            function(payload){


                const updated =
                    payload.new;




                const friend =
                    friends.find(
                        function(item){

                            return (
                                item.friend_id ===
                                updated.id
                            );

                        }
                    );



                if(friend){


                    friend.is_online =
                        updated.is_online;



                    friend.last_seen =
                        updated.last_seen;



                    renderFriends();


                }


            }


        )

        .subscribe();


}








// =====================================================
// AVATARS
// =====================================================


function setMyAvatar(
    name,
    avatarUrl
){



    if(!myAvatar){

        return;

    }



    if(avatarUrl){


        myAvatar.style.backgroundImage =
            `url("${avatarUrl}")`;


        myAvatar.textContent =
            "";



    }
    else{


        myAvatar.style.backgroundImage =
            "";


        myAvatar.textContent =
            getInitial(name);


    }


}







function createPersonAvatar(
    name,
    avatarUrl
){


    const avatar =
        document.createElement(
            "div"
        );



    avatar.className =
        "person-avatar";




    if(avatarUrl){


        avatar.style.backgroundImage =
            `url("${avatarUrl}")`;


    }
    else{


        avatar.textContent =
            getInitial(
                name
            );


    }



    return avatar;


}







function setConversationAvatar(
    name,
    avatarUrl
){



    if(!conversationAvatar){

        return;

    }





    if(avatarUrl){


        conversationAvatar.style.backgroundImage =
            `url("${avatarUrl}")`;


        conversationAvatar.textContent =
            "";



    }
    else{


        conversationAvatar.style.backgroundImage =
            "";


        conversationAvatar.textContent =
            getInitial(
                name
            );


    }



}







// =====================================================
// TOAST SYSTEM
// =====================================================


function createToastContainer(){


    if(toastContainer){

        return;

    }



    toastContainer =
        document.createElement(
            "div"
        );


    toastContainer.id =
        "memora-toast-container";



    document.body.appendChild(
        toastContainer
    );


}







function showMessageToast(
    notification
){



    if(!toastContainer){

        createToastContainer();

    }





    const toast =
        document.createElement(
            "div"
        );



    toast.className =
        "memora-toast";




    toast.innerHTML = `

        <div class="toast-title">
            ${escapeHtml(
                notification.title ||
                "New message"
            )}
        </div>


        <div class="toast-body">
            ${escapeHtml(
                notification.body ||
                ""
            )}
        </div>

    `;




    toast.addEventListener(
        "click",
        function(){

            openMessageNotification(
                notification
            );


            toast.remove();

        }
    );




    toastContainer.appendChild(
        toast
    );




    setTimeout(
        function(){

            toast.classList.add(
                "show"
            );

        },
        50
    );




    setTimeout(
        function(){

            toast.remove();

        },
        5000
    );



}







// =====================================================
// MESSAGE HELPERS
// =====================================================



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








function formatTime(
    date
){


    return new Date(
        date
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








function autoResizeMessageInput(){



    if(!messageInput){

        return;

    }




    messageInput.style.height =
        "auto";




    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            130
        )
        +
        "px";



}







function scrollMessagesToBottom(){



    requestAnimationFrame(
        function(){


            if(messageList){


                messageList.scrollTop =
                    messageList.scrollHeight;


            }


        }
    );


}








function setMessagesLoading(){



    if(!messageList){

        return;

    }



    messageList.innerHTML = `

        <div class="messages-empty">

            Loading...

        </div>

    `;


}







// =====================================================
// TEXT HELPERS
// =====================================================



function truncate(
    text,
    length
){


    if(
        text.length <=
        length
    ){

        return text;

    }



    return (
        text.substring(
            0,
            length
        )
        +
        "..."
    );


}






function escapeHtml(
    text
){


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;



    return div.innerHTML;


}







// =====================================================
// CLEANUP
// =====================================================



window.addEventListener(
    "beforeunload",
    function(){


        stopMessageRealtime();



        if(notificationChannel){

            supabaseClient.removeChannel(
                notificationChannel
            );

        }


    }
);
