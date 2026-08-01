// =====================================================
// MEMORA CHAT
// PART 1/3
// Core + Auth + Profile + Friends + Search
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
// DOM
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


let currentChatSearch =
    "";


let friendStatusChannel =
    null;


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeChat
);



async function initializeChat(){

    try{


        const {
            data,
            error
        } =
        await supabaseClient.auth.getSession();



        if(error){

            console.error(
                "Session error:",
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

        setupFriendPanel();

        setupSearch();


        await loadMyProfile();

        await loadFriends();


        subscribeToFriendStatus();



    }
    catch(error){

        console.error(
            "Chat init error:",
            error
        );

    }

}



// =====================================================
// NAVIGATION
// =====================================================


function setupNavigation(){


    if(profileButton){

        profileButton.onclick =
        function(){

            window.location.href =
                "profile.html";

        };

    }



    if(homeNav){

        homeNav.onclick =
        function(){

            window.location.href =
                "index.html";

        };

    }



    if(calendarNav){

        calendarNav.onclick =
        function(){

            window.location.href =
                "calendar.html";

        };

    }



    if(timelineNav){

        timelineNav.onclick =
        function(){

            window.location.href =
                "events.html";

        };

    }



    supabaseClient.auth.onAuthStateChange(
        function(event){

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
        .from(
            "profiles"
        )
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
            "Profile error:",
            error
        );


        setAvatar(
            currentUser.email,
            null
        );


        return;

    }



    setAvatar(
        data?.display_name ||
        currentUser.email,
        data?.avatar_url
    );


}




function setAvatar(
    name,
    url
){

    if(!myAvatar){

        return;

    }



    if(url){

        myAvatar.style.backgroundImage =
            `url("${url}")`;

        myAvatar.textContent =
            "";

        return;

    }



    myAvatar.style.backgroundImage =
        "";


    myAvatar.textContent =
        getInitial(name);

}




// =====================================================
// SEARCH
// =====================================================


function setupSearch(){


    if(
        searchButton &&
        emailSearch
    ){


        searchButton.onclick =
            searchUser;



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


        chatSearchInput.oninput =
        function(){

            currentChatSearch =
                chatSearchInput.value
                .trim()
                .toLowerCase();


            renderFriends();

        };


    }


}




async function searchUser(){


    const email =
        emailSearch.value
        .trim();



    if(!email){

        showSearchMessage(
            "Введите email"
        );

        return;

    }



    searchButton.disabled =
        true;



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

            showSearchMessage(
                "Пользователь не найден"
            );

            return;

        }



        renderSearchResult(
            data[0]
        );


    }
    catch(error){

        console.error(
            error
        );


        showSearchMessage(
            error.message
        );


    }
    finally{

        searchButton.disabled =
            false;

    }


}




function showSearchMessage(
    text
){

    if(searchMessage){

        searchMessage.textContent =
            text;

    }

}




function renderSearchResult(
    user
){


    if(!searchResult){

        return;

    }



    searchResult.innerHTML =
        "";



    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        "Добавить";


    button.onclick =
    function(){

        sendFriendRequest(
            user.id,
            button
        );

    };



    searchResult.append(
        user.display_name ||
        "Memora user",
        button
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
            "Отправлено";


    }
    catch(error){

        console.error(
            error
        );


        button.disabled =
            false;


        button.textContent =
            "Добавить";

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
            "Friends error:",
            error
        );


        friends =
            [];


        renderFriends();


        return;

    }



    friends =
        (data || []).map(
            friend => ({
                ...friend,
                is_online:
                    friend.is_online === true
            })
        );



    renderFriends();


}




function renderFriends(){


    if(!friendList){

        return;

    }



    friendList.innerHTML =
        "";



    const list =
        friends.filter(
            friend => {


                if(
                    !currentChatSearch
                ){

                    return true;

                }


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



    if(friendCount){

        friendCount.textContent =
            friends.length;

    }



    list.forEach(
        friend => {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "person-card";


            item.textContent =
                friend.display_name ||
                "User";



            friendList.append(
                item
            );


        }
    );


}




function setupFriendPanel(){


    if(
        addFriendButton &&
        addFriendPanel
    ){

        addFriendButton.onclick =
        function(){

            addFriendPanel.hidden =
                !addFriendPanel.hidden;

        };

    }



    if(closeAddFriendPanel){

        closeAddFriendPanel.onclick =
        function(){

            addFriendPanel.hidden =
                true;

        };

    }


}



// =====================================================
// ONLINE STATUS REALTIME
// =====================================================


function subscribeToFriendStatus(){


    if(friendStatusChannel){

        supabaseClient.removeChannel(
            friendStatusChannel
        );

    }



    friendStatusChannel =
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
            payload => {


                const updated =
                    payload.new;



                const friend =
                    friends.find(
                        f =>
                        f.friend_id ===
                        updated.id
                    );



                if(friend){

                    friend.is_online =
                        updated.is_online;


                    renderFriends();

                }


            }
        )
        .subscribe();


}



// =====================================================
// HELPERS
// =====================================================


function getInitial(
    name
){

    return String(
        name ||
        "M"
    )
    .charAt(0)
    .toUpperCase();


}
// =====================================================
// PART 2/3
// Notifications + Conversations + Messages
// =====================================================


// =====================================================
// STATE
// =====================================================


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


// =====================================================
// DOM
// =====================================================


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


const clearNotificationsButton =
    document.getElementById(
        "clearNotificationsButton"
    );


const closeNotificationPanel =
    document.getElementById(
        "closeNotificationPanel"
    );


const conversationView =
    document.getElementById(
        "conversationView"
    );


const friendsView =
    document.getElementById(
        "friendsView"
    );


const conversationBack =
    document.getElementById(
        "conversationBack"
    );


const conversationName =
    document.getElementById(
        "conversationName"
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




// =====================================================
// NOTIFICATIONS INIT
// =====================================================


async function initNotifications(){


    await loadNotifications();


    subscribeToNotifications();


}




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

        console.error(
            "Notification load error",
            error
        );

        return;

    }



    notifications =
        data || [];



    renderNotifications();


}




// =====================================================
// RENDER NOTIFICATIONS
// =====================================================


function renderNotifications(){


    if(!notificationList){

        return;

    }



    notificationList.innerHTML =
        "";



    if(notificationBadge){


        notificationBadge.textContent =
            notifications.length;


        notificationBadge.hidden =
            notifications.length === 0;


    }



    if(
        notifications.length === 0
    ){


        notificationList.innerHTML =
        `
        <div class="notification-empty">
            Нет новых уведомлений
        </div>
        `;


        return;

    }



    notifications.forEach(
        notification => {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "notification-card";



            item.textContent =
                notification.title ||
                notification.body ||
                "Новое уведомление";



            item.onclick =
            function(){


                if(
                    notification.type ===
                    "new_message"
                ){

                    openMessageNotification(
                        notification
                    );

                }


            };



            notificationList.append(
                item
            );


        }
    );


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

            payload => {



                notifications.unshift(
                    payload.new
                );



                renderNotifications();



            }

        )
        .subscribe();



}




// =====================================================
// CLEAR NOTIFICATIONS
// =====================================================


async function clearNotifications(){


    if(!currentUser){

        return;

    }



    await supabaseClient
        .from(
            "notifications"
        )
        .update(
            {
                read:true
            }
        )
        .eq(
            "user_id",
            currentUser.id
        );



    notifications =
        [];


    renderNotifications();


}




// =====================================================
// OPEN CHAT
// =====================================================


async function openConversation(
    friend
){


    if(
        !friend ||
        !friend.friend_id
    ){

        return;

    }



    activeFriend =
        friend;



    if(conversationName){

        conversationName.textContent =
            friend.display_name ||
            "User";

    }



    if(friendsView){

        friendsView.style.display =
            "none";

    }



    if(conversationView){

        conversationView.style.display =
            "flex";

    }



    const {
        data,
        error
    } =
    await supabaseClient.rpc(
        "get_or_create_direct_chat",
        {
            other_user_id:
                friend.friend_id
        }
    );



    if(error){

        console.error(
            error
        );

        return;

    }



    activeConversationId =
        data;



    await loadMessages();


    subscribeToMessages();


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
    } =
    await supabaseClient
        .from(
            "messages"
        )
        .select(
            `
            id,
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

        console.error(
            error
        );

        return;

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



    messages.forEach(
        appendMessage
    );



    scrollMessages();


}




function appendMessage(
    message
){


    const div =
        document.createElement(
            "div"
        );



    div.className =
        "message-bubble";



    if(
        message.sender_id ===
        currentUser.id
    ){

        div.classList.add(
            "mine"
        );

    }



    div.textContent =
        message.content;



    messageList.append(
        div
    );


}




// =====================================================
// SEND MESSAGE
// =====================================================


if(messageForm){


messageForm.addEventListener(
"submit",
async function(event){


event.preventDefault();



const text =
    messageInput.value.trim();



if(!text){

    return;

}



const {
    data,
    error
}
=
await supabaseClient
.from(
    "messages"
)
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

    console.error(
        error
    );

    return;

}



messageInput.value =
    "";


appendMessage(
    data
);


scrollMessages();



});

}



// =====================================================
// REALTIME MESSAGES
// =====================================================


function subscribeToMessages(){


    if(messageChannel){

        supabaseClient.removeChannel(
            messageChannel
        );

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
                    "messages"

            },

            payload => {


                if(
                    payload.new.conversation_id ===
                    activeConversationId
                ){

                    appendMessage(
                        payload.new
                    );


                    scrollMessages();

                }


            }

        )
        .subscribe();



}




// =====================================================
// CLOSE CHAT
// =====================================================


if(conversationBack){


conversationBack.onclick =
function(){


if(messageChannel){

    supabaseClient.removeChannel(
        messageChannel
    );

}


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


};


}



// =====================================================
// HELPERS
// =====================================================


function scrollMessages(){


if(messageList){


messageList.scrollTop =
    messageList.scrollHeight;


}


}
// =====================================================
// PART 3/3
// UI + Toast + Helpers + Protection
// =====================================================


// =====================================================
// TOAST SYSTEM
// =====================================================


let toastContainer = null;



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


    document.body.append(
        toastContainer
    );


}




function showToast(
    title,
    text
){


    createToastContainer();



    const toast =
        document.createElement(
            "div"
        );



    toast.className =
        "memora-toast";



    toast.innerHTML =
    `
        <strong>
            ${escapeHtml(title)}
        </strong>

        <span>
            ${escapeHtml(text)}
        </span>
    `;



    toastContainer.append(
        toast
    );



    setTimeout(
        ()=>{

            toast.classList.add(
                "show"
            );

        },
        50
    );



    setTimeout(
        ()=>{

            toast.remove();

        },
        4000
    );


}



// =====================================================
// MESSAGE TOAST
// =====================================================


function showMessageToast(
    notification
){


    if(
        !notification
    ){

        return;

    }



    showToast(
        notification.title ||
        "Новое сообщение",

        notification.body ||
        ""
    );


}



// =====================================================
// AVATARS
// =====================================================


function createAvatar(
    name,
    url
){


    const avatar =
        document.createElement(
            "div"
        );



    avatar.className =
        "memora-avatar";



    if(url){


        avatar.style.backgroundImage =
            `url("${url}")`;


    }
    else{


        avatar.textContent =
            getInitial(
                name
            );


    }



    return avatar;


}




function updateAvatar(
    element,
    name,
    url
){


    if(
        !element
    ){

        return;

    }



    if(url){


        element.style.backgroundImage =
            `url("${url}")`;


        element.textContent =
            "";


    }
    else{


        element.style.backgroundImage =
            "";


        element.textContent =
            getInitial(
                name
            );


    }


}




// =====================================================
// UNREAD COUNTERS
// =====================================================


function getUnreadMessages(
    friendId
){


    if(
        !friendId
    ){

        return 0;

    }



    return notifications.filter(
        notification => {


            return (

                notification.type ===
                "new_message"

                &&

                notification.sender_id ===
                friendId

            );


        }

    ).length;


}



// =====================================================
// MESSAGE DUPLICATE PROTECTION
// =====================================================


function messageAlreadyExists(
    id
){


    if(
        !messageList ||
        !id
    ){

        return false;

    }



    return Boolean(
        messageList.querySelector(
            `[data-id="${id}"]`
        )
    );


}




// Улучшенная версия appendMessage
// заменяет старую


function appendMessage(
    message
){


    if(
        !messageList ||
        !message
    ){

        return;

    }



    if(
        messageAlreadyExists(
            message.id
        )
    ){

        return;

    }



    const div =
        document.createElement(
            "div"
        );



    div.dataset.id =
        message.id;



    div.className =
        "message-bubble";



    if(
        message.sender_id ===
        currentUser.id
    ){

        div.classList.add(
            "mine"
        );

    }



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
            "small"
        );


    time.className =
        "message-time";


    time.textContent =
        formatTime(
            message.created_at
        );



    div.append(
        text,
        time
    );



    messageList.append(
        div
    );


}



// =====================================================
// FORMAT TIME
// =====================================================


function formatTime(
    date
){


    if(
        !date
    ){

        return "";

    }



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




// =====================================================
// AUTO RESIZE MESSAGE INPUT
// =====================================================


if(messageInput){


messageInput.addEventListener(
"input",
function(){


messageInput.style.height =
    "auto";


messageInput.style.height =
    Math.min(
        messageInput.scrollHeight,
        140
    )
    +
    "px";


});


}




// =====================================================
// PANELS CLOSE
// =====================================================


document.addEventListener(
"click",
function(event){



if(
    notificationPanel
    &&
    notificationButton
){


if(

    !notificationPanel.contains(
        event.target
    )

    &&

    !notificationButton.contains(
        event.target
    )

){


notificationPanel.hidden =
    true;


}



}




if(
    addFriendPanel
    &&
    addFriendButton
){


if(

    !addFriendPanel.contains(
        event.target
    )

    &&

    !addFriendButton.contains(
        event.target
    )

){


addFriendPanel.hidden =
    true;


}



}



});




// =====================================================
// HTML SECURITY
// =====================================================


function escapeHtml(
    text
){


const div =
    document.createElement(
        "div"
    );


div.textContent =
    text || "";



return div.innerHTML;


}



// =====================================================
// INITIAL LETTER
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

.charAt(
    0
)

.toUpperCase()


||
"M"

);


}



// =====================================================
// CLEANUP
// =====================================================


window.addEventListener(
"beforeunload",
function(){



if(messageChannel){

    supabaseClient.removeChannel(
        messageChannel
    );

}



if(notificationChannel){

    supabaseClient.removeChannel(
        notificationChannel
    );

}



});



// =====================================================
// TOAST CSS
// =====================================================


const toastStyle =
document.createElement(
"style"
);


toastStyle.textContent = `


#memora-toast-container{


position:
fixed;


top:
20px;


left:
50%;


transform:
translateX(-50%);


z-index:
99999;


display:
flex;


flex-direction:
column;


gap:
10px;


width:
min(
400px,
90vw
);


}



.memora-toast{


background:
rgba(
20,
20,
25,
0.95
);


border:
1px solid
rgba(
255,
255,
255,
0.1
);


border-radius:
18px;


padding:
14px;


color:
white;


display:
flex;


flex-direction:
column;


gap:
5px;


opacity:
0;


transform:
translateY(-20px);


transition:
0.25s;


backdrop-filter:
blur(20px);


}



.memora-toast.show{


opacity:
1;


transform:
translateY(0);


}



.memora-toast strong{


font-size:
14px;


}



.memora-toast span{


font-size:
12px;


color:
rgba(
255,
255,
255,.55
);


}



.message-time{


display:block;


font-size:
10px;


opacity:
.45;


margin-top:
5px;


}



`;


document.head.append(
toastStyle
);