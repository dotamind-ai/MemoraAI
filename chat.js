// =====================================================
// MEMORA CHAT JS
// PART 1 - CORE
// =====================================================


// ===============================
// SUPABASE
// ===============================
let currentUser = null;

let friends = [];

let notifications = [];

let activeFriend = null;

let activeConversationId = null;

let messageChannel = null;

let notificationChannel = null;

const SUPABASE_URL =
    "ТВОЙ_SUPABASE_URL";


const SUPABASE_ANON_KEY =
    "ТВОЙ_ANON_KEY";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );



// ===============================
// GLOBAL STATE
// ===============================


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



let notificationChannel =
    null;


let messageChannel =
    null;



// ===============================
// DOM ELEMENTS
// ===============================


// SEARCH


const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchButton =
    document.getElementById(
        "searchButton"
    );


const searchResult =
    document.getElementById(
        "searchResult"
    );


const searchMessage =
    document.getElementById(
        "searchMessage"
    );



// FRIENDS


const friendList =
    document.getElementById(
        "friendList"
    );


const friendCount =
    document.getElementById(
        "friendCount"
    );



// NOTIFICATIONS


const notificationButton =
    document.getElementById(
        "notificationButton"
    );


const notificationBadge =
    document.getElementById(
        "notificationBadge"
    );


const notificationList =
    document.getElementById(
        "notificationList"
    );



// CHAT


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



// TOAST


let toastContainer =
    null;



// ===============================
// START APP
// ===============================


document.addEventListener(
    "DOMContentLoaded",
    async function() {


        await initChat();


    }
);




// ===============================
// INIT
// ===============================


async function initChat() {


    try {


        const {
            data,
            error
        } =
        await supabaseClient
            .auth
            .getUser();



        if (error) {

            throw error;

        }



        if (!data.user) {


            console.error(
                "No user"
            );


            return;


        }



        currentUser =
            data.user;



        console.log(
            "Chat user:",
            currentUser.id
        );



        createToastContainer();



        setupEvents();



        await loadFriends();



        await loadNotifications();



        subscribeToNotifications();



        await openFriendFromUrl();



    }
    catch(error){


        console.error(
            "Chat init error:",
            error
        );


    }


}
// =====================================================
// USER SEARCH
// =====================================================


function setupEvents() {


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchUser
        );

    }



    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function(event){

                if (
                    event.key === "Enter"
                ){

                    searchUser();

                }

            }
        );

    }



    setupConversation();


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            toggleNotifications
        );

    }


}



// =====================================================
// SEARCH USER BY EMAIL
// =====================================================


async function searchUser() {


    if (!searchInput) {
        return;
    }



    const email =
        searchInput.value
            .trim()
            .toLowerCase();



    if (!email) {


        if (searchMessage) {

            searchMessage.textContent =
                "Enter email.";

        }


        return;

    }



    if (searchResult) {

        searchResult.innerHTML =
            "";

    }



    try {


        const {
            data,
            error
        } =
        await supabaseClient
            .rpc(
                "find_user_by_email",
                {
                    search_email:
                        email
                }
            );



        if (error) {

            throw error;

        }



        if (
            !data ||
            data.length === 0
        ) {


            searchResult.innerHTML = `

                <div class="empty-state">

                    User not found.

                </div>

            `;


            return;


        }



        const user =
            data[0];



        renderSearchUser(
            user
        );


    }
    catch(error){


        console.error(
            "Search error:",
            error
        );


        if (searchMessage) {

            searchMessage.textContent =
                error.message ||
                "Search failed.";

        }


    }


}




// =====================================================
// RENDER SEARCH RESULT
// =====================================================


function renderSearchUser(
    user
) {


    if (!searchResult) {
        return;
    }



    searchResult.innerHTML =
        "";



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



    info.appendChild(
        name
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



    button.addEventListener(
        "click",
        function(){

            sendFriendRequest(
                user.id,
                button
            );

        }
    );



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
// SEND FRIEND REQUEST
// =====================================================


async function sendFriendRequest(
    userId,
    button
){


    if (!userId) {
        return;
    }



    if (button) {

        button.disabled =
            true;


        button.textContent =
            "Sending...";

    }



    try {


        const {
            error
        } =
        await supabaseClient
            .rpc(
                "send_friend_request",
                {
                    target_user_id:
                        userId
                }
            );



        if (error) {

            throw error;

        }



        if (button) {


            button.textContent =
                "Sent";


            button.classList.remove(
                "primary"
            );


        }



        if (searchMessage) {


            searchMessage.textContent =
                "Friend request sent.";

        }



    }
    catch(error){


        console.error(
            "Friend request error:",
            error
        );



        if (button) {


            button.disabled =
                false;


            button.textContent =
                "Add";


        }



        if (searchMessage) {


            searchMessage.textContent =
                error.message ||
                "Unable to send request.";

        }


    }


}
// =====================================================
// FRIENDS
// =====================================================


async function loadFriends() {


    const {
        data,
        error
    } =
    await supabaseClient
        .rpc(
            "get_my_friends"
        );



    if (error) {


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
        data || [];



    renderFriends();


}



// =====================================================
// UNREAD COUNTER
// =====================================================


function getUnreadCountForFriend(
    friendId
) {


    if (!friendId) {

        return 0;

    }



    return notifications.filter(
        function(notification){


            return (

                notification.type ===
                "new_message"


                &&


                notification._friendId ===
                friendId

            );


        }
    ).length;


}




// =====================================================
// RENDER FRIENDS
// =====================================================


function renderFriends(){


    if (!friendList) {

        return;

    }



    friendList.innerHTML =
        "";



    if (friendCount) {


        friendCount.textContent =
            friends.length;


    }




    if (!friends.length){



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




            const nameRow =
                document.createElement(
                    "div"
                );


            nameRow.style.display =
                "flex";


            nameRow.style.alignItems =
                "center";


            nameRow.style.gap =
                "7px";




            const name =
                document.createElement(
                    "span"
                );


            name.className =
                "person-name";



            name.textContent =
                friend.display_name ||
                "Memora user";




            const unread =
                getUnreadCountForFriend(
                    friend.friend_id
                );



            nameRow.appendChild(
                name
            );




            if (unread > 0){



                const badge =
                    document.createElement(
                        "span"
                    );



                badge.className =
                    "chat-unread-badge";



                badge.textContent =
                    unread > 99
                        ? "99+"
                        : unread;



                nameRow.appendChild(
                    badge
                );


            }





            const status =
                document.createElement(
                    "span"
                );



            status.className =
                "person-email";



            if (friend.is_online){


                status.textContent =
                    "Online";


            }
            else {


                status.textContent =
                    unread > 0
                        ? `${unread} unread`
                        : "Start conversation";


            }




            info.appendChild(
                nameRow
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




            button.addEventListener(
                "click",
                function(){


                    openConversation(
                        friend
                    );


                }
            );






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
// NOTIFICATIONS
// =====================================================



async function loadNotifications() {


    if (!currentUser) {
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
                ascending:
                    false
            }
        );



    if (error) {


        console.error(
            "Notifications error:",
            error
        );


        notifications =
            [];


        renderNotifications();


        return;

    }



    notifications =
        data || [];



    await attachFriendIdsToNotifications();



    renderNotifications();


    renderFriends();


}





// =====================================================
// FIND FRIEND ID FOR MESSAGE NOTIFICATION
// =====================================================


async function attachFriendIdsToNotifications(){



    const messageNotifications =
        notifications.filter(
            function(notification){


                return (

                    notification.type ===
                    "new_message"


                    &&


                    notification.related_id

                );


            }
        );





    for (
        const notification
        of messageNotifications
    ){


        try {


            const {
                data,
                error
            } =
            await supabaseClient
                .from(
                    "conversation_members"
                )
                .select(
                    "user_id"
                )
                .eq(
                    "conversation_id",
                    notification.related_id
                )
                .neq(
                    "user_id",
                    currentUser.id
                )
                .maybeSingle();




            if (
                !error &&
                data
            ){


                notification._friendId =
                    data.user_id;


            }



        }
        catch(error){


            console.error(
                "Notification mapping error:",
                error
            );


        }



    }



}




// =====================================================
// RENDER NOTIFICATIONS
// =====================================================


function renderNotifications(){


    if (
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





    if (
        notifications.length === 0
    ){


        notificationList.innerHTML = `

            <div class="notification-empty">

                No notifications.

            </div>

        `;


        return;

    }





    notifications.forEach(
        function(notification){



            const card =
                document.createElement(
                    "div"
                );



            card.className =
                "notification-card";





            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "notification-avatar";



            avatar.textContent =
                getInitial(
                    notification.title
                );






            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "notification-info";





            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                notification.title ||
                "Notification";






            const body =
                document.createElement(
                    "span"
                );


            body.textContent =
                notification.body ||
                "";





            info.appendChild(
                title
            );


            info.appendChild(
                body
            );






            card.appendChild(
                avatar
            );


            card.appendChild(
                info
            );






            if (
                notification.type ===
                "friend_request"
            ){


                addFriendRequestActions(
                    card,
                    notification
                );


            }
            else {


                card.addEventListener(
                    "click",
                    function(){


                        openMessageNotification(
                            notification
                        );


                    }
                );


            }





            notificationList.appendChild(
                card
            );



        }
    );


}





// =====================================================
// OPEN / CLOSE NOTIFICATIONS
// =====================================================


function toggleNotifications(){


    const panel =
        document.getElementById(
            "notificationPanel"
        );


    if (!panel) {
        return;
    }



    panel.classList.toggle(
        "show"
    );


}





function closeNotifications(){


    const panel =
        document.getElementById(
            "notificationPanel"
        );


    if (!panel) {
        return;
    }



    panel.classList.remove(
        "show"
    );


}
// =====================================================
// FRIEND REQUEST ACTIONS
// =====================================================



function addFriendRequestActions(
    card,
    notification
){



    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "notification-actions";





    const accept =
        document.createElement(
            "button"
        );


    accept.type =
        "button";


    accept.className =
        "notification-action accept";


    accept.textContent =
        "Accept";





    accept.addEventListener(
        "click",
        async function(event){


            event.stopPropagation();


            await answerFriendRequest(
                notification,
                true
            );


        }
    );






    const reject =
        document.createElement(
            "button"
        );



    reject.type =
        "button";


    reject.className =
        "notification-action";


    reject.textContent =
        "Reject";





    reject.addEventListener(
        "click",
        async function(event){


            event.stopPropagation();


            await answerFriendRequest(
                notification,
                false
            );


        }
    );







    actions.appendChild(
        accept
    );


    actions.appendChild(
        reject
    );



    card.appendChild(
        actions
    );


}





// =====================================================
// ACCEPT / REJECT REQUEST
// =====================================================



async function answerFriendRequest(
    notification,
    accepted
){



    if (
        !notification.related_id
    ){

        return;

    }






    const rpcName =
        accepted
            ? "accept_friend_request"
            : "reject_friend_request";





    const {
        error
    } =
    await supabaseClient.rpc(
        rpcName,
        {
            request_id:
                notification.related_id
        }
    );





    if (error){


        console.error(
            "Friend request answer error:",
            error
        );


        alert(
            error.message
        );


        return;

    }





    await markNotificationRead(
        notification
    );





    await loadFriends();



}








// =====================================================
// LOAD INCOMING FRIEND REQUESTS
// =====================================================



async function loadFriendRequests(){



    const {
        data,
        error
    } =
    await supabaseClient.rpc(
        "get_my_friend_requests"
    );





    if (error){


        console.error(
            "Friend requests error:",
            error
        );


        friendRequests =
            [];


        return;

    }




    friendRequests =
        data || [];





}





// =====================================================
// SEND FRIEND REQUEST
// =====================================================



async function sendFriendRequest(
    targetUserId,
    button
){



    if (
        !targetUserId
    ){

        return;

    }





    if (
        button
    ){

        button.disabled =
            true;


        button.textContent =
            "Sending...";

    }





    const {
        error
    } =
    await supabaseClient.rpc(
        "send_friend_request",
        {
            target_user_id:
                targetUserId
        }
    );






    if(error){



        console.error(
            "Send friend request error:",
            error
        );



        if(button){


            button.disabled =
                false;


            button.textContent =
                "Add";


        }



        throw error;

    }






    if(button){


        button.disabled =
            true;


        button.textContent =
            "Sent";


        button.classList.remove(
            "primary"
        );


    }





}
// =====================================================
// USER SEARCH
// =====================================================



async function searchUserByEmail(){



    const input =
        document.getElementById(
            "friend-search-input"
        );



    const resultBox =
        document.getElementById(
            "friend-search-result"
        );



    if(
        !input ||
        !resultBox
    ){

        return;

    }




    const email =
        input.value
            .trim()
            .toLowerCase();





    if(
        !email
    ){

        resultBox.innerHTML = `
            <div class="empty-state">
                Enter email.
            </div>
        `;

        return;

    }






    resultBox.innerHTML = `
        <div class="empty-state">
            Searching...
        </div>
    `;





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



        console.error(
            "User search error:",
            error
        );



        resultBox.innerHTML = `
            <div class="empty-state">
                Search error.
            </div>
        `;


        return;

    }





    if(
        !data ||
        data.length === 0
    ){



        resultBox.innerHTML = `
            <div class="empty-state">
                User not found.
            </div>
        `;


        return;

    }







    renderSearchUser(
        data[0],
        resultBox
    );



}








function renderSearchUser(
    user,
    container
){



    container.innerHTML =
        "";





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







    const emailText =
        document.createElement(
            "span"
        );


    emailText.className =
        "person-email";


    emailText.textContent =
        user.id === currentUser.id
            ? "Your account"
            : "Memora user";





    info.appendChild(
        name
    );


    info.appendChild(
        emailText
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







    if(
        user.id === currentUser.id
    ){



        button.disabled =
            true;


        button.textContent =
            "You";

    }






    button.addEventListener(
        "click",
        async function(){



            try{


                await sendFriendRequest(
                    user.id,
                    button
                );


            }
            catch(error){


                alert(
                    error.message ||
                    "Unable to send request."
                );


            }



        }
    );






    card.appendChild(
        avatar
    );


    card.appendChild(
        info
    );


    card.appendChild(
        button
    );





    container.appendChild(
        card
    );



}









// =====================================================
// SEARCH BUTTON SETUP
// =====================================================



function setupFriendSearch(){



    const button =
        document.getElementById(
            "friend-search-button"
        );



    if(
        button
    ){


        button.addEventListener(
            "click",
            searchUserByEmail
        );


    }






    const input =
        document.getElementById(
            "friend-search-input"
        );



    if(
        input
    ){



        input.addEventListener(
            "keydown",
            function(event){


                if(
                    event.key ===
                    "Enter"
                ){


                    searchUserByEmail();


                }


            }
        );


    }



}
 // =====================================================
// FRIENDS LIST
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
            "Load friends error:",
            error
        );


        friends = [];


        renderFriends();


        return;

    }





    friends =
        data || [];



    renderFriends();



}








// =====================================================
// RENDER FRIENDS
// =====================================================



function renderFriends(){



    if(
        !friendList
    ){

        return;

    }




    friendList.innerHTML =
        "";





    if(
        friendCount
    ){


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








            // avatar

            const avatar =
                createPersonAvatar(
                    friend.display_name,
                    friend.avatar_url
                );







            // info

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







            if(
                friend.is_online
            ){



                status.textContent =
                    "Online";



                status.classList.add(
                    "online-status"
                );



            }
            else{



                status.textContent =
                    formatLastSeen(
                        friend.last_seen
                    );



            }







            info.appendChild(
                name
            );



            info.appendChild(
                status
            );









            // chat button


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







            button.addEventListener(
                "click",
                function(){


                    openConversation(
                        friend
                    );


                }
            );







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
// LAST SEEN FORMAT
// =====================================================



function formatLastSeen(
    date
){



    if(
        !date
    ){

        return "Offline";

    }




    const last =
        new Date(
            date
        );



    const now =
        new Date();




    const diff =
        Math.floor(
            (
                now -
                last
            )
            /
            1000
        );






    if(
        diff <
        60
    ){

        return "Was online just now";

    }





    if(
        diff <
        3600
    ){

        return (
            "Was online " +
            Math.floor(
                diff / 60
            )
            +
            " min ago"
        );

    }






    if(
        diff <
        86400
    ){

        return (
            "Was online " +
            Math.floor(
                diff / 3600
            )
            +
            " hours ago"
        );

    }





    return (
        "Was online " +
        last.toLocaleDateString(
            "ru-RU"
        )
    );

}








// =====================================================
// ONLINE STYLE
// =====================================================



function injectOnlineStyles(){



    if(
        document.getElementById(
            "memora-online-style"
        )
    ){

        return;

    }






    const style =
        document.createElement(
            "style"
        );



    style.id =
        "memora-online-style";



    style.textContent = `


        .online-status {

            color:
                #9effb1 !important;

        }



        .online-status::before {

            content:
                "";

            display:
                inline-block;

            width:
                7px;

            height:
                7px;

            margin-right:
                6px;


            border-radius:
                50%;


            background:
                #5cff7a;


            box-shadow:
                0 0 10px
                rgba(92,255,122,.8);

        }



    `;



    document.head.appendChild(
        style
    );



}
// =====================================================
// OPEN / CREATE DIRECT CHAT
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






    if(
        conversationName
    ){

        conversationName.textContent =
            friend.display_name ||
            "Memora user";

    }





    if(
        conversationStatus
    ){

        conversationStatus.textContent =
            friend.is_online
                ? "Online"
                : "Offline";

    }







    setConversationAvatar(
        friend.display_name,
        friend.avatar_url
    );







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








    window.history.replaceState(
        null,
        "",
        "chat.html?friend=" +
        encodeURIComponent(
            friend.friend_id
        )
    );







    setMessagesLoading();







    try {



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

            throw error;

        }







        activeConversationId =
            data;








        console.log(
            "Conversation:",
            activeConversationId
        );








        await loadMessages();






        await markCurrentConversationNotifications();







        subscribeToMessages();







        if(
            messageInput
        ){

            messageInput.focus();

        }





    }
    catch(error){



        console.error(
            "Open chat error:",
            error
        );



        if(
            messageList
        ){


            messageList.innerHTML = `

                <div class="messages-empty">

                    <div class="empty-title">
                        Error
                    </div>

                    <div class="empty-text">
                        ${
                            escapeHtml(
                                error.message ||
                                "Cannot open chat"
                            )
                        }
                    </div>

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







    window.history.replaceState(
        null,
        "",
        "chat.html"
    );







    setMessagesLoading();



}









// =====================================================
// CHAT BACK BUTTON
// =====================================================



function setupConversation(){





    if(
        conversationBack
    ){


        conversationBack.addEventListener(
            "click",
            closeConversation
        );


    }






    if(
        messageInput
    ){



        messageInput.addEventListener(
            "input",
            autoResizeMessageInput
        );


    }







    if(
        messageForm
    ){



        messageForm.addEventListener(
            "submit",
            sendMessage
        );


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
    } =
    await supabaseClient
        .from(
            "messages"
        )
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
                ascending:
                    true
            }
        );







    if(error){



        console.error(
            "Load messages error:",
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



    if(
        !messageList
    ){

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


            appendMessage(
                message
            );


        }
    );







    scrollMessagesToBottom();



}









// =====================================================
// APPEND MESSAGE
// =====================================================



function appendMessage(
    message
){



    if(
        !messageList ||
        !message
    ){

        return;

    }







    // защита от дублей realtime

    const exists =
        document.querySelector(
            `[data-message-id="${message.id}"]`
        );



    if(
        exists
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
            "my-message"
        );

    }
    else{


        row.classList.add(
            "friend-message"
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
        formatMessageTime(
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
// MESSAGE TIME
// =====================================================



function formatMessageTime(
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









// =====================================================
// SCROLL
// =====================================================



function scrollMessagesToBottom(){



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









// =====================================================
// MESSAGE STYLES
// =====================================================



function injectMessageStyles(){



    if(
        document.getElementById(
            "memora-message-style"
        )
    ){

        return;

    }






    const style =
        document.createElement(
            "style"
        );



    style.id =
        "memora-message-style";






    style.textContent = `



        .message-row {


            width:
                100%;


            display:
                flex;


            margin-bottom:
                10px;


        }





        .my-message {


            justify-content:
                flex-end;


        }





        .friend-message {


            justify-content:
                flex-start;


        }







        .message-bubble {


            max-width:
                75%;


            padding:
                10px 13px;


            border-radius:
                18px;


            display:
                flex;


            flex-direction:
                column;


            gap:
                5px;


            font-size:
                14px;


            line-height:
                1.4;


        }






        .my-message .message-bubble {


            background:
                rgba(139,92,246,.25);


            border:
                1px solid
                rgba(167,139,250,.35);


            color:
                white;


            border-bottom-right-radius:
                5px;


        }







        .friend-message .message-bubble {


            background:
                rgba(255,255,255,.07);


            border:
                1px solid
                rgba(255,255,255,.12);


            color:
                white;


            border-bottom-left-radius:
                5px;


        }







        .message-time {


            font-size:
                10px;


            opacity:
                .45;


            text-align:
                right;


        }





        .message-text {


            word-break:
                break-word;


        }



    `;




    document.head.appendChild(
        style
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







    const content =
        messageInput.value
            .trim();







    if(
        !content
    ){

        return;

    }








    if(
        sendMessageButton
    ){

        sendMessageButton.disabled =
            true;

    }







    try {




        const {
            data,
            error
        } =
        await supabaseClient
            .from(
                "messages"
            )
            .insert({

                conversation_id:
                    activeConversationId,


                sender_id:
                    currentUser.id,


                content:
                    content


            })
            .select(
                `
                id,
                conversation_id,
                sender_id,
                content,
                created_at
                `
            )
            .single();







        if(error){

            throw error;

        }







        // очищаем поле


        messageInput.value =
            "";



        autoResizeMessageInput();






        // сразу показываем сообщение


        appendMessage(
            data
        );



        scrollMessagesToBottom();





    }
    catch(error){



        console.error(
            "Send message error:",
            error
        );




        alert(
            error.message ||
            "Unable to send message"
        );



    }
    finally {



        if(
            sendMessageButton
        ){


            sendMessageButton.disabled =
                false;


        }





        messageInput.focus();



    }



}









// =====================================================
// AUTO RESIZE INPUT
// =====================================================



function autoResizeMessageInput(){



    if(
        !messageInput
    ){

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
// =====================================================
// MESSAGE REALTIME
// =====================================================



function subscribeToMessages(){



    stopMessageRealtime();






    if(
        !activeConversationId
    ){

        return;

    }








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



                function(payload){



                    const message =
                        payload.new;







                    // если это наше сообщение
                    // которое уже добавили через appendMessage

                    if(
                        message.sender_id ===
                        currentUser.id
                    ){

                        return;

                    }






                    appendMessage(
                        message
                    );



                    scrollMessagesToBottom();




                }



            )
            .subscribe(

                function(status){


                    console.log(
                        "Messages realtime:",
                        status
                    );


                }

            );



}









// =====================================================
// STOP REALTIME
// =====================================================



function stopMessageRealtime(){



    if(
        !messageChannel
    ){

        return;

    }







    supabaseClient.removeChannel(
        messageChannel
    );






    messageChannel =
        null;



}
// =====================================================
// LOAD NOTIFICATIONS
// =====================================================



async function loadNotifications(){



    if(
        !currentUser
    ){

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
            "Notifications error:",
            error
        );


        notifications =
            [];


        renderNotifications();


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



    if(
        !notificationList ||
        !notificationBadge
    ){

        return;

    }






    notificationList.innerHTML =
        "";






    notificationBadge.textContent =
        notifications.length;






    notificationBadge.hidden =
        notifications.length === 0;







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



            const card =
                document.createElement(
                    "div"
                );



            card.className =
                "notification-card";






            const avatar =
                document.createElement(
                    "div"
                );



            avatar.className =
                "notification-avatar";



            avatar.textContent =
                getInitial(
                    getSenderName(
                        notification.body
                    )
                );








            const info =
                document.createElement(
                    "div"
                );



            info.className =
                "notification-info";








            const title =
                document.createElement(
                    "strong"
                );



            title.textContent =
                notification.title ||
                "Notification";








            const body =
                document.createElement(
                    "span"
                );



            body.textContent =
                notification.body ||
                "";







            info.appendChild(
                title
            );


            info.appendChild(
                body
            );







            card.appendChild(
                avatar
            );


            card.appendChild(
                info
            );






            card.addEventListener(
                "click",
                async function(){



                    await openMessageNotification(
                        notification
                    );


                }
            );








            notificationList.appendChild(
                card
            );



        }
    );



}









// =====================================================
// OPEN NOTIFICATION
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
        notification
    );






    closeNotifications();






    window.location.href =
        "chat.html?conversation=" +
        notification.related_id;



}









// =====================================================
// MARK READ
// =====================================================



async function markNotificationRead(
    notification
){



    const {
        error
    } =
    await supabaseClient
        .from(
            "notifications"
        )
        .update({

            read:
                true

        })
        .eq(
            "id",
            notification.id
        );







    if(error){


        console.error(
            "Read error:",
            error
        );


        return;

    }






    notifications =
        notifications.filter(
            function(item){


                return (
                    item.id !==
                    notification.id
                );


            }
        );





    renderNotifications();



}
// =====================================================
// INITIALIZATION
// =====================================================



async function initChat(){



    console.log(
        "Memora chat starting..."
    );






    try {



        const {
            data,
            error
        } =
        await supabaseClient.auth.getUser();






        if(error){

            throw error;

        }







        if(
            !data.user
        ){



            console.warn(
                "User not logged"
            );



            window.location.href =
                "index.html";


            return;


        }







        currentUser =
            data.user;







        console.log(
            "Current user:",
            currentUser.id
        );







        await loadFriends();






        await loadNotifications();







        subscribeToMessages();







        subscribeToNotifications();







        setupConversation();







        setupNotifications();







        await openFriendFromUrl();







    }
    catch(error){



        console.error(
            "Chat init error:",
            error
        );



    }



}









// =====================================================
// AUTO START
// =====================================================



document.addEventListener(
    "DOMContentLoaded",
    function(){



        injectToastStyles();

        injectMessageStyles();



        initChat();



    }
);

