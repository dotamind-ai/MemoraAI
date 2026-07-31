// =====================================================
// MEMORA CHAT
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
    document.getElementById("emailSearch");

const searchButton =
    document.getElementById("searchButton");

const searchMessage =
    document.getElementById("searchMessage");

const searchResult =
    document.getElementById("searchResult");

const requestList =
    document.getElementById("requestList");

const friendList =
    document.getElementById("friendList");

const requestCount =
    document.getElementById("requestCount");

const friendCount =
    document.getElementById("friendCount");

const backButton =
    document.getElementById("backButton");

const profileButton =
    document.getElementById("profileButton");

const myAvatar =
    document.getElementById("myAvatar");

const homeNav =
    document.getElementById("homeNav");

const calendarNav =
    document.getElementById("calendarNav");

const timelineNav =
    document.getElementById("timelineNav");

const friendsView =
    document.getElementById("friendsView");

const conversationView =
    document.getElementById("conversationView");

const conversationBack =
    document.getElementById("conversationBack");

const conversationAvatar =
    document.getElementById("conversationAvatar");

const conversationName =
    document.getElementById("conversationName");

const conversationStatus =
    document.getElementById("conversationStatus");

const messageList =
    document.getElementById("messageList");

const messageForm =
    document.getElementById("messageForm");

const messageInput =
    document.getElementById("messageInput");

const sendMessageButton =
    document.getElementById("sendMessageButton");


// =====================================================
// STATE
// =====================================================

let currentUser = null;

let friends = [];

let requests = [];

let activeFriend = null;

let activeConversationId = null;

let realtimeChannel = null;


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeChats
);


async function initializeChats() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();


        if (
            error ||
            !data.user
        ) {

            redirectToWelcome();

            return;

        }


        currentUser =
            data.user;


        setupNavigation();

        setupSearch();

        setupConversation();


        await loadMyProfile();

        await loadFriends();

        await loadRequests();


        const params =
            new URLSearchParams(
                window.location.search
            );


        const friendId =
            params.get("friend");


        if (friendId) {

            const friend =
                friends.find(
                    function(item) {

                        return (
                            item.friend_id ===
                            friendId
                        );

                    }
                );


            if (friend) {

                await openConversation(
                    friend
                );

            }

        }


    } catch (error) {

        console.error(
            "Chat initialization error:",
            error
        );

        redirectToWelcome();

    }

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {


    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";

        }
    );


    profileButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "profile.html";

        }
    );


    homeNav.addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";

        }
    );


    calendarNav.addEventListener(
        "click",
        function() {

            window.location.href =
                "calendar.html";

        }
    );


    timelineNav.addEventListener(
        "click",
        function() {

            window.location.href =
                "events.html";

        }
    );


    supabaseClient.auth.onAuthStateChange(
        function(event, session) {

            if (
                event === "SIGNED_OUT" ||
                !session
            ) {

                redirectToWelcome();

            }

        }
    );

}


// =====================================================
// LOAD MY PROFILE
// =====================================================

async function loadMyProfile() {


    const {
        data,
        error
    } = await supabaseClient

        .from("profiles")

        .select(
            "display_name, avatar_url"
        )

        .eq(
            "id",
            currentUser.id
        )

        .maybeSingle();


    if (error) {

        console.error(
            "My profile error:",
            error
        );

        setMyAvatar(
            currentUser.email,
            null
        );

        return;

    }


    if (data) {

        setMyAvatar(
            data.display_name ||
            currentUser.email,
            data.avatar_url
        );

    } else {

        setMyAvatar(
            currentUser.email,
            null
        );

    }

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {


    searchButton.addEventListener(
        "click",
        searchUser
    );


    emailSearch.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                searchUser();

            }

        }
    );

}


async function searchUser() {


    const email =
        emailSearch.value.trim();


    searchResult.innerHTML =
        "";

    searchMessage.textContent =
        "";


    if (!email) {

        searchMessage.textContent =
            "Enter an email address.";

        return;

    }


    if (!email.includes("@")) {

        searchMessage.textContent =
            "Enter a valid email address.";

        return;

    }


    searchButton.disabled =
        true;

    searchButton.textContent =
        "...";


    try {

        const {
            data,
            error
        } = await supabaseClient.rpc(
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

            searchMessage.textContent =
                "User not found.";

            return;

        }


        renderSearchResult(
            data[0],
            email
        );


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        searchMessage.textContent =
            error.message ||
            "Search failed.";

    } finally {

        searchButton.disabled =
            false;

        searchButton.textContent =
            "Find";

    }

}


// =====================================================
// SEARCH RESULT
// =====================================================

function renderSearchResult(
    user,
    email
) {


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


    const emailElement =
        document.createElement(
            "span"
        );


    emailElement.className =
        "person-email";


    emailElement.textContent =
        email;


    info.appendChild(name);

    info.appendChild(
        emailElement
    );


    const action =
        document.createElement(
            "button"
        );


    action.className =
        "person-action primary";


    action.type =
        "button";


    action.textContent =
        "Add";


    action.addEventListener(
        "click",
        function() {

            sendFriendRequest(
                user.id,
                action
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
        action
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
) {


    button.disabled =
        true;


    button.textContent =
        "...";


    try {

        const {
            error
        } = await supabaseClient.rpc(
            "send_friend_request",
            {
                target_user_id:
                    userId
            }
        );


        if (error) {

            throw error;

        }


        button.textContent =
            "Sent";


        button.classList.remove(
            "primary"
        );


        searchMessage.textContent =
            "Friend request sent.";


    } catch (error) {

        console.error(
            "Friend request error:",
            error
        );


        button.disabled =
            false;


        button.textContent =
            "Add";


        searchMessage.textContent =
            error.message ||
            "Unable to send request.";

    }

}


// =====================================================
// FRIENDS
// =====================================================

async function loadFriends() {


    const {
        data,
        error
    } = await supabaseClient.rpc(
        "get_my_friends"
    );


    if (error) {

        console.error(
            "Friends error:",
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


function renderFriends() {


    friendList.innerHTML =
        "";


    friendCount.textContent =
        friends.length;


    if (!friends.length) {

        friendList.innerHTML = `
            <div class="empty-state">
                No friends yet.
            </div>
        `;

        return;

    }


    friends.forEach(
        function(friend) {


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


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "person-email";


            label.textContent =
                "Friend";


            info.appendChild(
                name
            );

            info.appendChild(
                label
            );


            const action =
                document.createElement(
                    "button"
                );


            action.className =
                "person-action primary";


            action.type =
                "button";


            action.textContent =
                "Chat";


            action.addEventListener(
                "click",
                function() {

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
                action
            );


            friendList.appendChild(
                card
            );

        }
    );

}


// =====================================================
// REQUESTS
// =====================================================

async function loadRequests() {


    const {
        data,
        error
    } = await supabaseClient.rpc(
        "get_my_friend_requests"
    );


    if (error) {

        console.error(
            "Requests error:",
            error
        );

        requests = [];

        renderRequests();

        return;

    }


    requests =
        data || [];


    renderRequests();

}


function renderRequests() {


    requestList.innerHTML =
        "";


    requestCount.textContent =
        requests.length;


    if (!requests.length) {

        requestList.innerHTML = `
            <div class="empty-state">
                No pending requests.
            </div>
        `;

        return;

    }


    requests.forEach(
        function(request) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "person-card";


            const avatar =
                createPersonAvatar(
                    request.display_name,
                    request.avatar_url
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
                request.display_name ||
                "Memora user";


            info.appendChild(
                name
            );


            const actions =
                document.createElement(
                    "div"
                );


            actions.style.display =
                "flex";


            actions.style.gap =
                "6px";


            const accept =
                document.createElement(
                    "button"
                );


            accept.className =
                "person-action primary";


            accept.type =
                "button";


            accept.textContent =
                "Accept";


            accept.addEventListener(
                "click",
                function() {

                    respondToRequest(
                        request.friendship_id,
                        true
                    );

                }
            );


            const reject =
                document.createElement(
                    "button"
                );


            reject.className =
                "person-action";


            reject.type =
                "button";


            reject.textContent =
                "Reject";


            reject.addEventListener(
                "click",
                function() {

                    respondToRequest(
                        request.friendship_id,
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
                avatar
            );

            card.appendChild(
                info
            );

            card.appendChild(
                actions
            );


            requestList.appendChild(
                card
            );

        }
    );

}


// =====================================================
// REQUEST RESPONSE
// =====================================================

async function respondToRequest(
    requestId,
    accept
) {


    const functionName =
        accept
            ? "accept_friend_request"
            : "reject_friend_request";


    try {

        const {
            error
        } = await supabaseClient.rpc(
            functionName,
            {
                request_id:
                    requestId
            }
        );


        if (error) {

            throw error;

        }


        await loadRequests();

        await loadFriends();


    } catch (error) {

        console.error(
            "Friend response error:",
            error
        );


        alert(
            error.message ||
            "Unable to update request."
        );

    }

}


// =====================================================
// CONVERSATION
// =====================================================

function setupConversation() {


    conversationBack.addEventListener(
        "click",
        closeConversation
    );


    messageForm.addEventListener(
        "submit",
        sendMessage
    );


    messageInput.addEventListener(
        "input",
        autoResizeInput
    );

}


async function openConversation(
    friend
) {


    activeFriend =
        friend;


    conversationName.textContent =
        friend.display_name ||
        "Memora user";


    conversationStatus.textContent =
        "Private conversation";


    setConversationAvatar(
        friend.display_name,
        friend.avatar_url
    );


    friendsView.style.display =
        "none";


    conversationView.style.display =
        "flex";


    history.replaceState(
        null,
        "",
        `chat.html?friend=${encodeURIComponent(friend.friend_id)}`
    );


    setMessagesLoading();


    try {


        const {
            data,
            error
        } = await supabaseClient.rpc(
            "get_or_create_direct_chat",
            {
                other_user_id:
                    friend.friend_id
            }
        );


        if (error) {

            throw error;

        }


        activeConversationId =
            data;


        await loadMessages();


        subscribeToMessages();


        messageInput.focus();


    } catch (error) {


        console.error(
            "Open conversation error:",
            error
        );


        messageList.innerHTML = `
            <div class="messages-empty">

                <div class="empty-title">
                    Unable to open chat
                </div>

                <div class="empty-text">
                    ${escapeHtml(
                        error.message ||
                        "Please try again."
                    )}
                </div>

            </div>
        `;

    }

}


function closeConversation() {


    stopRealtime();


    activeFriend =
        null;


    activeConversationId =
        null;


    conversationView.style.display =
        "none";


    friendsView.style.display =
        "block";


    history.replaceState(
        null,
        "",
        "chat.html"
    );


    setMessagesLoading();

}


// =====================================================
// MESSAGES
// =====================================================

async function loadMessages() {


    if (!activeConversationId) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("messages")

        .select(
            "id, conversation_id, sender_id, content, created_at"
        )

        .eq(
            "conversation_id",
            activeConversationId
        )

        .order(
            "created_at",
            {
                ascending: true
            }
        );


    if (error) {

        throw error;

    }


    renderMessages(
        data || []
    );

}


function renderMessages(
    messages
) {


    messageList.innerHTML =
        "";


    if (!messages.length) {

        messageList.innerHTML = `
            <div class="messages-empty">

                <div class="empty-icon">
                    ◇
                </div>

                <div class="empty-title">
                    No messages yet
                </div>

                <div class="empty-text">
                    Start the conversation.
                </div>

            </div>
        `;

        return;

    }


    messages.forEach(
        appendMessage
    );


    scrollMessages();

}


function appendMessage(
    message
) {


    if (
        document.querySelector(
            `[data-message-id="${message.id}"]`
        )
    ) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "message-bubble-row";


    if (
        message.sender_id ===
        currentUser.id
    ) {

        row.classList.add(
            "mine"
        );

    }


    row.dataset.messageId =
        message.id;


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
// SEND
// =====================================================

async function sendMessage(
    event
) {


    event.preventDefault();


    if (
        !activeConversationId
    ) {

        return;

    }


    const content =
        messageInput.value.trim();


    if (!content) {

        return;

    }


    sendMessageButton.disabled =
        true;


    try {


        const {
            data,
            error
        } = await supabaseClient

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
                "id, conversation_id, sender_id, content, created_at"
            )

            .single();


        if (error) {

            throw error;

        }


        messageInput.value =
            "";


        autoResizeInput();


        appendMessage(
            data
        );


        scrollMessages();


    } catch (error) {

        console.error(
            "Send message error:",
            error
        );


        alert(
            error.message ||
            "Unable to send message."
        );

    } finally {

        sendMessageButton.disabled =
            false;

        messageInput.focus();

    }

}


// =====================================================
// REALTIME
// =====================================================

function subscribeToMessages() {


    stopRealtime();


    if (!activeConversationId) {

        return;

    }


    realtimeChannel =
        supabaseClient

            .channel(
                "chat-" +
                activeConversationId
            )

            .on(
                "postgres_changes",
                {
                    event: "INSERT",

                    schema: "public",

                    table: "messages",

                    filter:
                        `conversation_id=eq.${activeConversationId}`
                },
                function(payload) {


                    appendMessage(
                        payload.new
                    );


                    scrollMessages();

                }
            )

            .subscribe();

}


function stopRealtime() {


    if (
        realtimeChannel
    ) {

        supabaseClient.removeChannel(
            realtimeChannel
        );


        realtimeChannel =
            null;

    }

}


// =====================================================
// AVATARS
// =====================================================

function setMyAvatar(
    name,
    avatarUrl
) {


    if (avatarUrl) {

        myAvatar.textContent =
            "";

        myAvatar.style.backgroundImage =
            `url("${avatarUrl}")`;

        return;

    }


    myAvatar.style.backgroundImage =
        "";


    myAvatar.textContent =
        getInitial(name);

}


function createPersonAvatar(
    name,
    avatarUrl
) {


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "person-avatar";


    if (avatarUrl) {

        avatar.style.backgroundImage =
            `url("${avatarUrl}")`;

    } else {

        avatar.textContent =
            getInitial(name);

    }


    return avatar;

}


function setConversationAvatar(
    name,
    avatarUrl
) {


    if (avatarUrl) {

        conversationAvatar.textContent =
            "";

        conversationAvatar.style.backgroundImage =
            `url("${avatarUrl}")`;

        return;

    }


    conversationAvatar.style.backgroundImage =
        "";


    conversationAvatar.textContent =
        getInitial(name);

}


function getInitial(name) {


    return (
        String(
            name ||
            "M"
        )
        .trim()
        .charAt(0)
        .toUpperCase()
        || "M"
    );

}


// =====================================================
// UI
// =====================================================

function setMessagesLoading() {


    messageList.innerHTML = `
        <div class="messages-empty">

            <div class="empty-title">
                Loading...
            </div>

        </div>
    `;

}


function scrollMessages() {


    requestAnimationFrame(
        function() {

            messageList.scrollTop =
                messageList.scrollHeight;

        }
    );

}


function autoResizeInput() {


    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            130
        ) +
        "px";

}


// =====================================================
// TIME
// =====================================================

function formatTime(
    dateString
) {


    return new Date(
        dateString
    ).toLocaleTimeString(
        "ru-RU",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================================
// ESCAPE
// =====================================================

function escapeHtml(value) {


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


// =====================================================
// REDIRECT
// =====================================================

function redirectToWelcome() {

    window.location.href =
        "welcome/welcome.html";

}