// =====================================================
// MEMORA CHAT
// Friends + Notifications + Messages + Realtime
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
    document.getElementById(
        "chatSearchInput"
    );

const profileButton =
    document.getElementById(
        "profileButton"
    );

const myAvatar =
    document.getElementById("myAvatar");

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

let currentUser = null;

let friends = [];

let legacyRequests = [];

let notifications = [];

let activeFriend = null;

let activeConversationId = null;

let realtimeMessageChannel = null;

let realtimeNotificationChannel = null;

let currentChatSearch = "";


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeChat
);


async function initializeChat() {

    try {

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

    if (addFriendButton) {

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


    if (notificationButton) {

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

    if (!currentUser) {
        return;
    }


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

    info.appendChild(emailElement);


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


    card.appendChild(avatar);

    card.appendChild(info);

    card.appendChild(action);


    searchResult.appendChild(card);

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


            card.appendChild(avatar);

            card.appendChild(info);

            card.appendChild(action);


            friendList.appendChild(card);

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


    // Подстраховка для старых заявок,
    // которые могли существовать до создания
    // notification trigger.

    await loadLegacyRequests();


    notifications =
        mergeNotifications(
            notifications,
            legacyRequests
        );


    renderNotifications();

}


// =====================================================
// LEGACY REQUESTS FALLBACK
// =====================================================

async function loadLegacyRequests() {

    const {
        data,
        error
    } = await supabaseClient.rpc(
        "get_my_friend_requests"
    );


    if (error) {

        console.error(
            "Friend requests fallback error:",
            error
        );


        legacyRequests =
            [];


        return;

    }


    legacyRequests =
        data || [];

}


// =====================================================
// MERGE NOTIFICATIONS
// =====================================================

function mergeNotifications(
    databaseNotifications,
    requests
) {

    const result = [
        ...databaseNotifications
    ];


    const existingRequestIds =
        new Set(
            databaseNotifications
                .filter(
                    function(item) {

                        return (
                            item.type ===
                            "friend_request"
                        );

                    }
                )
                .map(
                    function(item) {

                        return item.related_id;

                    }
                )
        );


    requests.forEach(
        function(request) {

            if (
                existingRequestIds.has(
                    request.friendship_id
                )
            ) {

                return;

            }


            result.push({

                id:
                    "legacy-" +
                    request.friendship_id,

                user_id:
                    currentUser.id,

                type:
                    "friend_request",

                title:
                    "Friend request",

                body:
                    (
                        request.display_name ||
                        "Memora user"
                    )
                    +
                    " wants to connect with you.",

                related_id:
                    request.friendship_id,

                read:
                    false,

                created_at:
                    new Date().toISOString(),

                legacy:
                    true,

                request:
                    request

            });

        }
    );


    result.sort(
        function(a, b) {

            return (
                new Date(b.created_at) -
                new Date(a.created_at)
            );

        }
    );


    return result;

}


// =====================================================
// RENDER NOTIFICATIONS
// =====================================================

function renderNotifications() {

    if (
        !notificationList ||
        !notificationBadge
    ) {

        return;
    }


    const unreadCount =
        notifications.length;


    notificationBadge.textContent =
        unreadCount;


    notificationBadge.hidden =
        unreadCount === 0;


    notificationList.innerHTML =
        "";


    if (!unreadCount) {

        notificationList.innerHTML = `
            <div class="notification-empty">
                No new notifications.
            </div>
        `;

        return;

    }


    notifications.forEach(
        function(notification) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "notification-card";


            let displayName =
                "Memora user";

            let avatarUrl =
                null;


            if (
                notification.type ===
                "friend_request" &&
                notification.request
            ) {

                displayName =
                    notification.request
                        .display_name ||
                    "Memora user";


                avatarUrl =
                    notification.request
                        .avatar_url ||
                    null;

            }


            if (
                notification.type ===
                "new_message"
            ) {

                const parsed =
                    parseSenderFromBody(
                        notification.body
                    );


                displayName =
                    parsed.name;


                // Для сообщения
                // аватар получим отдельно
                // при необходимости.

            }


            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "notification-avatar";


            if (avatarUrl) {

                avatar.style.backgroundImage =
                    `url("${avatarUrl}")`;

            } else {

                avatar.textContent =
                    getInitial(
                        displayName
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


            card.appendChild(
                avatar
            );


            card.appendChild(
                info
            );


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
                    createNotificationButton(
                        "Accept",
                        "accept"
                    );


                accept.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        acceptFriendNotification(
                            notification
                        );

                    }
                );


                const reject =
                    createNotificationButton(
                        "Reject",
                        ""
                    );


                reject.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        rejectFriendNotification(
                            notification
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
    );

}


// =====================================================
// NOTIFICATION BUTTON
// =====================================================

function createNotificationButton(
    text,
    type
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "notification-action";


    if (type) {

        button.classList.add(
            type
        );

    }


    button.textContent =
        text;


    return button;

}


// =====================================================
// FRIEND NOTIFICATION
// =====================================================

async function acceptFriendNotification(
    notification
) {

    if (
        notification.request
    ) {

        await respondToFriendRequest(
            notification.request
                .friendship_id,
            true
        );


        await markNotificationRead(
            notification
        );


        return;

    }


    const {
        data: request
    } = await supabaseClient
        .from("friendships")
        .select(
            "id"
        )
        .eq(
            "id",
            notification.related_id
        )
        .maybeSingle();


    if (request) {

        await respondToFriendRequest(
            request.id,
            true
        );

    }


    await markNotificationRead(
        notification
    );

}


async function rejectFriendNotification(
    notification
) {

    if (
        notification.request
    ) {

        await respondToFriendRequest(
            notification.request
                .friendship_id,
            false
        );


        await markNotificationRead(
            notification
        );


        return;

    }


    const {
        data: request
    } = await supabaseClient
        .from("friendships")
        .select(
            "id"
        )
        .eq(
            "id",
            notification.related_id
        )
        .maybeSingle();


    if (request) {

        await respondToFriendRequest(
            request.id,
            false
        );

    }


    await markNotificationRead(
        notification
    );

}


async function respondToFriendRequest(
    requestId,
    accept
) {

    const functionName =
        accept
            ? "accept_friend_request"
            : "reject_friend_request";


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

        console.error(
            "Friend request action error:",
            error
        );

        return;

    }


    await loadFriends();

    await loadNotifications();

}


// =====================================================
// MESSAGE NOTIFICATION
// =====================================================

async function openMessageNotification(
    notification
) {

    if (
        !notification.related_id
    ) {

        await markNotificationRead(
            notification
        );

        return;

    }


    // related_id = conversation_id

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

        await markNotificationRead(
            notification
        );

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


    if (!friend) {

        await markNotificationRead(
            notification
        );

        return;

    }


    await markNotificationRead(
        notification
    );


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

    if (
        notification.legacy
    ) {

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


        return;

    }


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
            "Mark notification error:",
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

    if (
        !currentUser
    ) {

        return;

    }


    if (
        realtimeNotificationChannel
    ) {

        supabaseClient.removeChannel(
            realtimeNotificationChannel
        );

    }


    realtimeNotificationChannel =
        supabaseClient

            .channel(
                "notifications-" +
                currentUser.id
            )

            .on(
                "postgres_changes",
                {
                    event: "INSERT",

                    schema: "public",

                    table: "notifications",

                    filter:
                        "user_id=eq." +
                        currentUser.id
                },
                async function(payload) {

                    const notification =
                        payload.new;


                    // Если сообщение пришло
                    // от другого пользователя
                    // в уже открытый чат,
                    // не показываем лишнее
                    // уведомление.

                    if (
                        notification.type ===
                        "new_message" &&

                        notification.related_id ===
                        activeConversationId
                    ) {

                        return;

                    }


                    // Не добавляем дубль.

                    const exists =
                        notifications.some(
                            function(item) {

                                return (
                                    item.id ===
                                    notification.id
                                );

                            }
                        );


                    if (!exists) {

                        notifications.unshift(
                            notification
                        );

                    }


                    renderNotifications();

                }
            )

            .subscribe();

}


// =====================================================
// MESSAGES
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


function closeConversation() {

    stopRealtimeMessages();


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

    if (
        !activeConversationId
    ) {

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


    scrollMessagesToBottom();

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
// REALTIME MESSAGES
// =====================================================

function subscribeToMessages() {

    stopRealtimeMessages();


    if (
        !activeConversationId
    ) {

        return;

    }


    realtimeMessageChannel =
        supabaseClient

            .channel(
                "messages-" +
                activeConversationId
            )

            .on(
                "postgres_changes",
                {
                    event: "INSERT",

                    schema: "public",

                    table: "messages",

                    filter:
                        "conversation_id=eq." +
                        activeConversationId
                },
                async function(payload) {

                    appendMessage(
                        payload.new
                    );


                    scrollMessagesToBottom();


                    // Если сообщение пришло
                    // в текущий чат,
                    // оно не должно оставаться
                    // непрочитанным уведомлением.

                    const notification =
                        notifications.find(
                            function(item) {

                                return (
                                    item.type ===
                                    "new_message" &&

                                    item.related_id ===
                                    activeConversationId
                                );

                            }
                        );


                    if (notification) {

                        await markNotificationRead(
                            notification
                        );

                    }

                }
            )

            .subscribe();

}


function stopRealtimeMessages() {

    if (
        !realtimeMessageChannel
    ) {

        return;

    }


    supabaseClient.removeChannel(
        realtimeMessageChannel
    );


    realtimeMessageChannel =
        null;

}


// =====================================================
// AVATARS
// =====================================================

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

    if (
        !conversationAvatar
    ) {

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


// =====================================================
// NOTIFICATION HELPERS
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


// =====================================================
// UI
// =====================================================

function setMessagesLoading() {

    if (
        !messageList
    ) {

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