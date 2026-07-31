// =====================================================
// MEMORA CHAT
// Friends + Notifications + Messages + Realtime
// + Floating message notifications
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

const notificationButton =
    document.getElementById("notificationButton");

const notificationBadge =
    document.getElementById("notificationBadge");

const notificationPanel =
    document.getElementById("notificationPanel");

const notificationList =
    document.getElementById("notificationList");

const closeNotificationPanel =
    document.getElementById(
        "closeNotificationPanel"
    );

const addFriendButton =
    document.getElementById("addFriendButton");

const addFriendPanel =
    document.getElementById("addFriendPanel");

const closeAddFriendPanel =
    document.getElementById(
        "closeAddFriendPanel"
    );

const friendList =
    document.getElementById("friendList");

const friendCount =
    document.getElementById("friendCount");

const chatSearchInput =
    document.getElementById("chatSearchInput");

const profileButton =
    document.getElementById("profileButton");

const myAvatar =
    document.getElementById("myAvatar");

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

const homeNav =
    document.getElementById("homeNav");

const calendarNav =
    document.getElementById("calendarNav");

const timelineNav =
    document.getElementById("timelineNav");


// =====================================================
// STATE
// =====================================================

let currentUser = null;

let friends = [];

let notifications = [];

let activeFriend = null;

let activeConversationId = null;

let messageChannel = null;

let notificationChannel = null;

let currentChatSearch = "";

let toastContainer = null;


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeChat
);


async function initializeChat() {

    try {

        injectToastStyles();

        createToastContainer();


        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }


        if (!data.session) {

            window.location.href =
                "welcome/welcome.html";

            return;

        }


        currentUser =
            data.session.user;


        setupNavigation();

        setupPanels();

        setupSearch();

        setupConversationEvents();


        await loadMyProfile();

        await loadFriends();

        await loadNotifications();


        subscribeToNotifications();


        await openFriendFromUrl();


    } catch (error) {

        console.error(
            "Chat initialization error:",
            error
        );

    }

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                window.location.href =
                    "profile.html";

            }
        );

    }


    if (homeNav) {

        homeNav.addEventListener(
            "click",
            function() {

                window.location.href =
                    "index.html";

            }
        );

    }


    if (calendarNav) {

        calendarNav.addEventListener(
            "click",
            function() {

                window.location.href =
                    "calendar.html";

            }
        );

    }


    if (timelineNav) {

        timelineNav.addEventListener(
            "click",
            function() {

                window.location.href =
                    "events.html";

            }
        );

    }


    supabaseClient.auth.onAuthStateChange(
        function(event) {

            if (
                event === "SIGNED_OUT"
            ) {

                window.location.href =
                    "welcome/welcome.html";

            }

        }
    );

}


// =====================================================
// PANELS
// =====================================================

function setupPanels() {

    if (
        addFriendButton &&
        addFriendPanel
    ) {

        addFriendButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                closeNotifications();

                addFriendPanel.hidden =
                    !addFriendPanel.hidden;


                if (
                    !addFriendPanel.hidden &&
                    emailSearch
                ) {

                    emailSearch.focus();

                }

            }
        );

    }


    if (closeAddFriendPanel) {

        closeAddFriendPanel.addEventListener(
            "click",
            closeAddFriend
        );

    }


    if (
        notificationButton &&
        notificationPanel
    ) {

        notificationButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                closeAddFriend();

                notificationPanel.hidden =
                    !notificationPanel.hidden;

            }
        );

    }


    if (closeNotificationPanel) {

        closeNotificationPanel.addEventListener(
            "click",
            closeNotifications
        );

    }


    document.addEventListener(
        "click",
        function(event) {

            if (
                notificationPanel &&
                !notificationPanel.hidden &&
                !notificationPanel.contains(
                    event.target
                ) &&
                notificationButton &&
                !notificationButton.contains(
                    event.target
                )
            ) {

                closeNotifications();

            }


            if (
                addFriendPanel &&
                !addFriendPanel.hidden &&
                !addFriendPanel.contains(
                    event.target
                ) &&
                addFriendButton &&
                !addFriendButton.contains(
                    event.target
                )
            ) {

                closeAddFriend();

            }

        }
    );

}


function closeNotifications() {

    if (notificationPanel) {

        notificationPanel.hidden =
            true;

    }

}


function closeAddFriend() {

    if (addFriendPanel) {

        addFriendPanel.hidden =
            true;

    }

}


// =====================================================
// PROFILE
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
            "Profile error:",
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
        currentUser.email ||
        "M",
        data?.avatar_url ||
        null
    );

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    if (
        searchButton &&
        emailSearch
    ) {

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


    if (chatSearchInput) {

        chatSearchInput.addEventListener(
            "input",
            function() {

                currentChatSearch =
                    chatSearchInput.value
                        .trim()
                        .toLowerCase();

                renderFriends();

            }
        );

    }

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


function renderSearchResult(
    user,
    email
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
// FRIEND REQUEST
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
            "Request sent.";


    } catch (error) {

        console.error(
            "Request error:",
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

    if (!friendList) {
        return;
    }


    friendList.innerHTML =
        "";


    const filtered =
        friends.filter(
            function(friend) {

                if (
                    !currentChatSearch
                ) {

                    return true;

                }


                const name =
                    (
                        friend.display_name ||
                        ""
                    ).toLowerCase();


                return name.includes(
                    currentChatSearch
                );

            }
        );


    if (friendCount) {

        friendCount.textContent =
            friends.length;

    }


    if (!filtered.length) {

        friendList.innerHTML = `
            <div class="empty-state">
                ${
                    friends.length
                        ? "No chats found."
                        : "No friends yet."
                }
            </div>
        `;

        return;

    }


    filtered.forEach(
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
                "Start a conversation";


            info.appendChild(name);

            info.appendChild(label);


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
// NOTIFICATIONS
// =====================================================

async function loadNotifications() {

    if (!currentUser) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("notifications")
        .select(
            "id, user_id, type, title, body, related_id, read, created_at"
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
                ascending: false
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


    renderNotifications();

}


function renderNotifications() {

    if (
        !notificationList ||
        !notificationBadge
    ) {

        return;

    }


    notificationBadge.textContent =
        notifications.length;


    notificationBadge.hidden =
        notifications.length === 0;


    notificationList.innerHTML =
        "";


    if (!notifications.length) {

        notificationList.innerHTML = `
            <div class="notification-empty">
                No new notifications.
            </div>
        `;

        return;

    }


    notifications.forEach(
        renderSingleNotification
    );

}


function renderSingleNotification(
    notification
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "notification-card";


    const display =
        getNotificationDisplay(
            notification
        );


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "notification-avatar";


    if (display.avatarUrl) {

        avatar.style.backgroundImage =
            `url("${display.avatarUrl}")`;

    } else {

        avatar.textContent =
            getInitial(
                display.name
            );

    }


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


    info.appendChild(title);

    info.appendChild(body);


    card.appendChild(avatar);

    card.appendChild(info);


    if (
        notification.type ===
        "friend_request"
    ) {

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
            async function(event) {

                event.stopPropagation();

                await handleFriendRequest(
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
            async function(event) {

                event.stopPropagation();

                await handleFriendRequest(
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

    } else {

        card.style.cursor =
            "pointer";


        card.addEventListener(
            "click",
            function() {

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


// =====================================================
// FRIEND REQUEST ACTION
// =====================================================

async function handleFriendRequest(
    notification,
    accepted
) {

    const functionName =
        accepted
            ? "accept_friend_request"
            : "reject_friend_request";


    const {
        error
    } = await supabaseClient.rpc(
        functionName,
        {
            request_id:
                notification.related_id
        }
    );


    if (error) {

        console.error(
            "Friend request error:",
            error
        );

        return;

    }


    await markNotificationRead(
        notification
    );


    await loadFriends();

}


// =====================================================
// MESSAGE NOTIFICATION CLICK
// =====================================================

async function openMessageNotification(
    notification
) {

    if (
        !notification.related_id
    ) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient
        .from("conversation_members")
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


    if (error) {

        console.error(
            "Conversation member error:",
            error
        );

        return;

    }


    if (!data) {
        return;
    }


    const friend =
        friends.find(
            function(item) {

                return (
                    item.friend_id ===
                    data.user_id
                );

            }
        );


    await markNotificationRead(
        notification
    );


    if (!friend) {
        return;
    }


    closeNotifications();


    await openConversation(
        friend
    );

}


// =====================================================
// MARK READ
// =====================================================

async function markNotificationRead(
    notification
) {

    const {
        error
    } = await supabaseClient
        .from("notifications")
        .update({
            read: true
        })
        .eq(
            "id",
            notification.id
        )
        .eq(
            "user_id",
            currentUser.id
        );


    if (error) {

        console.error(
            "Notification read error:",
            error
        );

        return;

    }


    notifications =
        notifications.filter(
            function(item) {

                return (
                    item.id !==
                    notification.id
                );

            }
        );


    renderNotifications();

}


// =====================================================
// REALTIME NOTIFICATIONS
// =====================================================

function subscribeToNotifications() {

    if (!currentUser) {
        return;
    }


    if (notificationChannel) {

        supabaseClient.removeChannel(
            notificationChannel
        );

    }


    notificationChannel =
        supabaseClient
            .channel(
                "notification-feed-" +
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
                function(payload) {

                    handleIncomingNotification(
                        payload.new
                    );

                }
            )
            .subscribe();

}


// =====================================================
// INCOMING NOTIFICATION
// =====================================================

function handleIncomingNotification(
    notification
) {

    if (!notification) {
        return;
    }


    if (
        notification.type ===
        "new_message"
    ) {

        // Если мы уже открыли этот диалог,
        // уведомление нам не нужно.

        if (
            notification.related_id ===
            activeConversationId
        ) {

            markDatabaseNotificationReadDirect(
                notification.id
            );

            return;

        }


        addNotification(
            notification
        );


        showMessageToast(
            notification
        );


        return;

    }


    addNotification(
        notification
    );

}


// =====================================================
// ADD NOTIFICATION
// =====================================================

function addNotification(
    notification
) {

    const exists =
        notifications.some(
            function(item) {

                return (
                    item.id ===
                    notification.id
                );

            }
        );


    if (exists) {
        return;
    }


    notifications.unshift(
        notification
    );


    renderNotifications();

}


// =====================================================
// DIRECT MARK READ
// =====================================================

async function markDatabaseNotificationReadDirect(
    notificationId
) {

    const {
        error
    } = await supabaseClient
        .from("notifications")
        .update({
            read: true
        })
        .eq(
            "id",
            notificationId
        )
        .eq(
            "user_id",
            currentUser.id
        );


    if (error) {

        console.error(
            "Notification read error:",
            error
        );

        return;
    }


    notifications =
        notifications.filter(
            function(item) {

                return (
                    item.id !==
                    notificationId
                );

            }
        );


    renderNotifications();

}


// =====================================================
// CONVERSATION
// =====================================================

function setupConversationEvents() {

    if (conversationBack) {

        conversationBack.addEventListener(
            "click",
            closeConversation
        );

    }


    if (messageForm) {

        messageForm.addEventListener(
            "submit",
            sendMessage
        );

    }


    if (messageInput) {

        messageInput.addEventListener(
            "input",
            autoResizeMessageInput
        );

    }

}


async function openFriendFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const friendId =
        params.get(
            "friend"
        );


    if (!friendId) {
        return;
    }


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


async function openConversation(
    friend
) {

    if (
        !friend ||
        !friend.friend_id
    ) {

        return;

    }


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

        await markOpenConversationNotificationsRead();

        subscribeToMessages();


        if (messageInput) {

            messageInput.focus();

        }


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


// =====================================================
// MARK OPEN CONVERSATION NOTIFICATIONS
// =====================================================

async function markOpenConversationNotificationsRead() {

    if (!activeConversationId) {
        return;
    }


    const matches =
        notifications.filter(
            function(item) {

                return (
                    item.type ===
                    "new_message" &&
                    item.related_id ===
                    activeConversationId
                );

            }
        );


    for (
        const notification
        of matches
    ) {

        await supabaseClient
            .from("notifications")
            .update({
                read: true
            })
            .eq(
                "id",
                notification.id
            )
            .eq(
                "user_id",
                currentUser.id
            );

    }


    notifications =
        notifications.filter(
            function(item) {

                return !(
                    item.type ===
                    "new_message" &&
                    item.related_id ===
                    activeConversationId
                );

            }
        );


    renderNotifications();

}


function closeConversation() {

    stopMessageRealtime();


    activeFriend =
        null;


    activeConversationId =
        null;


    conversationView.style.display =
        "none";


    friendsView.style.display =
        "block";


    window.history.replaceState(
        null,
        "",
        "chat.html"
    );


    setMessagesLoading();

}


// =====================================================
// LOAD MESSAGES
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

    if (!messageList) {
        return;
    }


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


    scrollMessagesToBottom();

}


function appendMessage(
    message
) {

    if (!messageList) {
        return;
    }


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
// SEND MESSAGE
// =====================================================

async function sendMessage(
    event
) {

    event.preventDefault();


    if (
        !activeConversationId ||
        !currentUser
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


        autoResizeMessageInput();


        appendMessage(
            data
        );


        scrollMessagesToBottom();


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
// MESSAGE REALTIME
// =====================================================

function subscribeToMessages() {

    stopMessageRealtime();


    if (!activeConversationId) {
        return;
    }


    messageChannel =
        supabaseClient
            .channel(
                "messages-" +
                activeConversationId +
                "-" +
                Date.now()
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

                    appendMessage(
                        payload.new
                    );


                    scrollMessagesToBottom();

                    markOpenConversationNotificationsRead();

                }
            )
            .subscribe();

}


function stopMessageRealtime() {

    if (!messageChannel) {
        return;
    }


    supabaseClient.removeChannel(
        messageChannel
    );


    messageChannel =
        null;

}


// =====================================================
// FLOATING TOAST
// =====================================================

function createToastContainer() {

    if (toastContainer) {
        return;
    }


    toastContainer =
        document.createElement(
            "div"
        );


    toastContainer.id =
        "memoraToastContainer";


    toastContainer.style.position =
        "fixed";


    toastContainer.style.top =
        "12px";


    toastContainer.style.left =
        "50%";


    toastContainer.style.transform =
        "translateX(-50%)";


    toastContainer.style.width =
        "min(430px, calc(100vw - 24px))";


    toastContainer.style.zIndex =
        "9999";


    toastContainer.style.display =
        "flex";


    toastContainer.style.flexDirection =
        "column";


    toastContainer.style.gap =
        "8px";


    toastContainer.style.pointerEvents =
        "none";


    document.body.appendChild(
        toastContainer
    );

}


function showMessageToast(
    notification
) {

    if (!toastContainer) {
        createToastContainer();
    }


    const display =
        getNotificationDisplay(
            notification
        );


    const toast =
        document.createElement(
            "button"
        );


    toast.type =
        "button";


    toast.style.width =
        "100%";


    toast.style.minHeight =
        "66px";


    toast.style.display =
        "flex";


    toast.style.alignItems =
        "center";


    toast.style.gap =
        "10px";


    toast.style.padding =
        "9px 10px";


    toast.style.border =
        "1px solid rgba(255,255,255,.12)";


    toast.style.borderRadius =
        "18px";


    toast.style.background =
        "rgba(18,18,24,.95)";


    toast.style.backdropFilter =
        "blur(24px)";


    toast.style.boxShadow =
        "0 20px 60px rgba(0,0,0,.40), 0 0 35px rgba(139,92,246,.10)";


    toast.style.color =
        "white";


    toast.style.textAlign =
        "left";


    toast.style.fontFamily =
        "inherit";


    toast.style.cursor =
        "pointer";


    toast.style.pointerEvents =
        "auto";


    toast.style.opacity =
        "0";


    toast.style.transform =
        "translateY(-18px) scale(.97)";


    toast.style.transition =
        "opacity .24s ease, transform .24s ease";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.style.width =
        "44px";


    avatar.style.height =
        "44px";


    avatar.style.flexShrink =
        "0";


    avatar.style.display =
        "flex";


    avatar.style.alignItems =
        "center";


    avatar.style.justifyContent =
        "center";


    avatar.style.borderRadius =
        "50%";


    avatar.style.overflow =
        "hidden";


    avatar.style.background =
        "rgba(255,255,255,.07)";


    avatar.style.border =
        "1px solid rgba(255,255,255,.10)";


    avatar.style.backgroundPosition =
        "center";


    avatar.style.backgroundSize =
        "cover";


    if (display.avatarUrl) {

        avatar.style.backgroundImage =
            `url("${display.avatarUrl}")`;

    } else {

        avatar.textContent =
            getInitial(
                display.name
            );

    }


    const content =
        document.createElement(
            "div"
        );


    content.style.flex =
        "1";


    content.style.minWidth =
        "0";


    content.style.display =
        "flex";


    content.style.flexDirection =
        "column";


    content.style.gap =
        "3px";


    const title =
        document.createElement(
            "strong"
        );


    title.textContent =
        display.name;


    title.style.fontSize =
        "12px";


    const text =
        document.createElement(
            "span"
        );


    text.textContent =
        truncate(
            extractMessage(
                notification.body
            ),
            85
        );


    text.style.fontSize =
        "10px";


    text.style.color =
        "rgba(255,255,255,.43)";


    text.style.overflow =
        "hidden";


    text.style.textOverflow =
        "ellipsis";


    text.style.whiteSpace =
        "nowrap";


    content.appendChild(
        title
    );


    content.appendChild(
        text
    );


    const close =
        document.createElement(
            "span"
        );


    close.textContent =
        "×";


    close.style.width =
        "26px";


    close.style.height =
        "26px";


    close.style.display =
        "flex";


    close.style.alignItems =
        "center";


    close.style.justifyContent =
        "center";


    close.style.borderRadius =
        "9px";


    close.style.background =
        "rgba(255,255,255,.05)";


    close.style.color =
        "rgba(255,255,255,.45)";


    close.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            removeToast(
                toast
            );

        }
    );


    toast.appendChild(
        avatar
    );


    toast.appendChild(
        content
    );


    toast.appendChild(
        close
    );


    toast.addEventListener(
        "click",
        function() {

            openMessageNotification(
                notification
            );


            removeToast(
                toast
            );

        }
    );


    toastContainer.appendChild(
        toast
    );


    requestAnimationFrame(
        function() {

            toast.style.opacity =
                "1";


            toast.style.transform =
                "translateY(0) scale(1)";

        }
    );


    setTimeout(
        function() {

            removeToast(
                toast
            );

        },
        5000
    );

}


function removeToast(
    toast
) {

    if (
        !toast ||
        !toast.parentNode
    ) {

        return;

    }


    toast.style.opacity =
        "0";


    toast.style.transform =
        "translateY(-14px) scale(.98)";


    setTimeout(
        function() {

            if (
                toast.parentNode
            ) {

                toast.remove();

            }

        },
        250
    );

}


// =====================================================
// HELPERS
// =====================================================

function parseSenderFromBody(
    body
) {

    const text =
        String(
            body || ""
        );


    const separator =
        text.indexOf(":");


    if (
        separator === -1
    ) {

        return {
            name:
                "New message"
        };

    }


    return {
        name:
            text
                .slice(
                    0,
                    separator
                )
                .trim()
    };

}


function getNotificationDisplay(
    notification
) {

    let name =
        "Memora user";


    let avatarUrl =
        null;


    if (
        notification.type ===
        "new_message"
    ) {

        const parsed =
            parseSenderFromBody(
                notification.body
            );


        name =
            parsed.name;

    }


    return {
        name,
        avatarUrl
    };

}


function extractMessage(
    body
) {

    const text =
        String(
            body || ""
        );


    const separator =
        text.indexOf(":");


    if (
        separator === -1
    ) {

        return text;

    }


    return text
        .slice(
            separator + 1
        )
        .trim();

}


function truncate(
    text,
    maxLength
) {

    if (
        text.length <=
        maxLength
    ) {

        return text;

    }


    return (
        text.slice(
            0,
            maxLength - 1
        )
        +
        "…"
    );

}


function setMyAvatar(
    name,
    avatarUrl
) {

    if (!myAvatar) {
        return;
    }


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
        getInitial(
            name
        );

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
            getInitial(
                name
            );

    }


    return avatar;

}


function setConversationAvatar(
    name,
    avatarUrl
) {

    if (!conversationAvatar) {
        return;
    }


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
        getInitial(
            name
        );

}


function getInitial(
    name
) {

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


function setMessagesLoading() {

    if (!messageList) {
        return;
    }


    messageList.innerHTML = `
        <div class="messages-empty">

            <div class="empty-title">
                Loading...
            </div>

        </div>
    `;

}


function scrollMessagesToBottom() {

    requestAnimationFrame(
        function() {

            if (
                messageList
            ) {

                messageList.scrollTop =
                    messageList.scrollHeight;

            }

        }
    );

}


function autoResizeMessageInput() {

    if (!messageInput) {
        return;
    }


    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            125
        ) +
        "px";

}


function formatTime(
    dateString
) {

    return new Date(
        dateString
    ).toLocaleTimeString(
        "ru-RU",
        {
            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}


function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}