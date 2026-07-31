// =====================================================
// MEMORA CHAT
// Friends + Notifications + Messages + Unread Counters
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

const clearNotificationsButton =
    document.getElementById("clearNotificationsButton");

const closeNotificationPanel =
    document.getElementById("closeNotificationPanel");

const addFriendButton =
    document.getElementById("addFriendButton");

const addFriendPanel =
    document.getElementById("addFriendPanel");

const closeAddFriendPanel =
    document.getElementById("closeAddFriendPanel");

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
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeChat
);


async function initializeChat() {

    try {

        createToastContainer();
        injectToastStyles();


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


        if (
            !data ||
            !data.session
        ) {

            window.location.href =
                "welcome/welcome.html";

            return;

        }


        currentUser =
            data.session.user;


        setupNavigation();

        setupPanels();

        setupSearch();

        setupConversation();


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
                event ===
                "SIGNED_OUT"
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


    if (clearNotificationsButton) {

        clearNotificationsButton.addEventListener(
            "click",
            clearAllNotifications
        );

    }


    document.addEventListener(
        "click",
        function(event) {

            if (
                notificationPanel &&
                !notificationPanel.hidden &&
                notificationButton &&
                !notificationPanel.contains(
                    event.target
                ) &&
                !notificationButton.contains(
                    event.target
                )
            ) {

                closeNotifications();

            }


            if (
                addFriendPanel &&
                !addFriendPanel.hidden &&
                addFriendButton &&
                !addFriendPanel.contains(
                    event.target
                ) &&
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
// CLEAR NOTIFICATIONS
// =====================================================

async function clearAllNotifications() {

    if (!currentUser) {
        return;
    }


    if (clearNotificationsButton) {

        clearNotificationsButton.disabled =
            true;

        clearNotificationsButton.textContent =
            "...";

    }


    try {

        const {
            error
        } = await supabaseClient
            .from("notifications")
            .update({
                read: true
            })
            .eq(
                "user_id",
                currentUser.id
            )
            .eq(
                "read",
                false
            );


        if (error) {
            throw error;
        }


        notifications = [];


        renderNotifications();
        renderFriends();


    } catch (error) {

        console.error(
            "Clear notifications error:",
            error
        );

    } finally {

        if (clearNotificationsButton) {

            clearNotificationsButton.disabled =
                false;

            clearNotificationsButton.textContent =
                "Clear";

        }

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
                    event.key ===
                    "Enter"
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

    if (
        !emailSearch ||
        !searchButton
    ) {

        return;

    }


    const email =
        emailSearch.value.trim();


    if (searchResult) {
        searchResult.innerHTML = "";
    }


    if (searchMessage) {
        searchMessage.textContent = "";
    }


    if (!email) {

        if (searchMessage) {
            searchMessage.textContent =
                "Enter an email address.";
        }

        return;

    }


    if (!email.includes("@")) {

        if (searchMessage) {
            searchMessage.textContent =
                "Enter a valid email address.";
        }

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

            if (searchMessage) {
                searchMessage.textContent =
                    "User not found.";
            }

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


        if (searchMessage) {

            searchMessage.textContent =
                error.message ||
                "Search failed.";

        }

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


    info.appendChild(name);
    info.appendChild(mail);


    const action =
        document.createElement(
            "button"
        );


    action.type =
        "button";


    action.className =
        "person-action primary";


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


        if (searchMessage) {
            searchMessage.textContent =
                "Request sent.";
        }


    } catch (error) {

        console.error(
            "Friend request error:",
            error
        );


        button.disabled =
            false;

        button.textContent =
            "Add";


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


function getUnreadCountForFriend(
    friendId
) {

    if (!friendId) {
        return 0;
    }


    return notifications.filter(
        function(notification) {

            return (
                notification.type ===
                "new_message" &&

                getConversationFriendId(
                    notification
                ) ===
                friendId
            );

        }
    ).length;

}


function getConversationFriendId(
    notification
) {

    if (
        !notification ||
        !notification.related_id
    ) {

        return null;

    }


    // We don't store friend_id directly
    // inside notifications.
    //
    // Therefore this function first checks
    // whether the currently known friend
    // already has this conversation cached.

    if (
        notification._friendId
    ) {

        return notification._friendId;

    }


    return null;

}


function refreshUnreadCounts() {

    notifications.forEach(
        function(notification) {

            if (
                notification.type !==
                "new_message"
            ) {

                return;

            }


            if (
                notification._friendId
            ) {

                return;

            }

        }
    );

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


            if (unread > 0) {

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
                    name
                );


                nameRow.appendChild(
                    badge
                );

            } else {

                nameRow.appendChild(
                    name
                );

            }


            const status =
                document.createElement(
                    "span"
                );


            status.className =
                "person-email";


            status.textContent =
                unread > 0
                    ? unread === 1
                        ? "1 unread message"
                        : `${unread} unread messages`
                    : "Start a conversation";


            info.appendChild(
                nameRow
            );


            info.appendChild(
                status
            );


            const action =
                document.createElement(
                    "button"
                );


            action.type =
                "button";


            action.className =
                "person-action primary";


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

    const {
        data,
        error
    } = await supabaseClient
        .from("notifications")
        .select(
            "id,user_id,type,title,body,related_id,read,created_at"
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
        renderFriends();

        return;

    }


    notifications =
        data || [];


    renderNotifications();
    await attachFriendIdsToNotifications();
    renderFriends();

}


async function attachFriendIdsToNotifications() {

    const messageNotifications =
        notifications.filter(
            function(notification) {

                return (
                    notification.type ===
                    "new_message" &&
                    notification.related_id
                );

            }
        );


    for (
        const notification
        of messageNotifications
    ) {

        try {

            const {
                data
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


            if (data) {

                notification._friendId =
                    data.user_id;

            }

        } catch (error) {

            console.error(
                "Unread mapping error:",
                error
            );

        }

    }

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
        function(notification) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "notification-card";


            const displayName =
                notification.type ===
                    "new_message"
                    ? getSenderName(
                        notification.body
                    )
                    : "Memora user";


            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "notification-avatar";


            avatar.textContent =
                getInitial(
                    displayName
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
            ) {

                addFriendRequestActions(
                    card,
                    notification
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


function addFriendRequestActions(
    card,
    notification
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
        async function(event) {

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


async function answerFriendRequest(
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
// OPEN MESSAGE NOTIFICATION
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


    closeNotifications();


    if (friend) {

        await openConversation(
            friend
        );

    }

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
            "Mark notification read error:",
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

    await attachFriendIdsToNotifications();

    renderFriends();

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
                "memora-notifications-" +
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


                    if (
                        notification.type ===
                            "new_message" &&
                        notification.related_id ===
                            activeConversationId
                    ) {

                        await markDatabaseNotificationRead(
                            notification.id
                        );

                        return;

                    }


                    if (
                        notifications.some(
                            function(item) {

                                return (
                                    item.id ===
                                    notification.id
                                );

                            }
                        )
                    ) {

                        return;

                    }


                    notifications.unshift(
                        notification
                    );


                    await attachFriendIdsToNotifications();

                    renderNotifications();

                    renderFriends();


                    if (
                        notification.type ===
                        "new_message"
                    ) {

                        showMessageToast(
                            notification
                        );

                    }

                }
            )
            .subscribe();

}


// =====================================================
// DIRECT READ
// =====================================================

async function markDatabaseNotificationRead(
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
            "Direct notification read error:",
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

    await attachFriendIdsToNotifications();

    renderFriends();

}


// =====================================================
// CONVERSATION
// =====================================================

function setupConversation() {

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

        await markCurrentConversationNotifications();


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


async function markCurrentConversationNotifications() {

    if (!activeConversationId) {
        return;
    }


    const matches =
        notifications.filter(
            function(notification) {

                return (
                    notification.type ===
                    "new_message" &&
                    notification.related_id ===
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
            function(notification) {

                return !(
                    notification.type ===
                    "new_message" &&
                    notification.related_id ===
                    activeConversationId
                );

            }
        );


    renderNotifications();

    await attachFriendIdsToNotifications();

    renderFriends();

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
            "id,conversation_id,sender_id,content,created_at"
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
        !messageInput
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
                "id,conversation_id,sender_id,content,created_at"
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

                    appendMessage(
                        payload.new
                    );


                    scrollMessagesToBottom();


                    markCurrentConversationNotifications();

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
// TOAST
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
        "memora-chat-toast-container";


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


    const sender =
        getSenderName(
            notification.body
        );


    const message =
        getMessageText(
            notification.body
        );


    const toast =
        document.createElement(
            "button"
        );


    toast.type =
        "button";


    toast.className =
        "memora-chat-toast";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "memora-chat-toast-avatar";


    avatar.textContent =
        getInitial(
            sender
        );


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "memora-chat-toast-content";


    const title =
        document.createElement(
            "strong"
        );


    title.textContent =
        sender;


    const text =
        document.createElement(
            "span"
        );


    text.textContent =
        truncate(
            message,
            90
        );


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


    close.className =
        "memora-chat-toast-close";


    close.textContent =
        "×";


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

            toast.classList.add(
                "show"
            );

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


    toast.classList.remove(
        "show"
    );


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


// =====================================================
// HELPERS
// =====================================================

function getSenderName(
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

        return "Memora user";

    }


    return (
        text
            .slice(
                0,
                separator
            )
            .trim()
        ||
        "Memora user"
    );

}


function getMessageText(
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

            if (messageList) {

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


// =====================================================
// TOAST STYLES
// =====================================================

function injectToastStyles() {

    if (
        document.getElementById(
            "memora-chat-toast-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "memora-chat-toast-styles";


    style.textContent = `

        #memora-chat-toast-container {

            position: fixed;

            top: 12px;

            left: 50%;

            transform:
                translateX(-50%);

            width:
                min(
                    430px,
                    calc(100vw - 24px)
                );

            z-index:
                999999;

            display:
                flex;

            flex-direction:
                column;

            gap:
                8px;

            pointer-events:
                none;

        }


        .memora-chat-toast {

            width:
                100%;

            min-height:
                66px;

            display:
                flex;

            align-items:
                center;

            gap:
                10px;

            padding:
                9px 10px;

            border:
                1px solid
                rgba(255,255,255,.12);

            border-radius:
                18px;

            background:
                rgba(18,18,24,.96);

            color:
                #ffffff;

            box-shadow:
                0 20px 60px
                rgba(0,0,0,.40);

            backdrop-filter:
                blur(24px);

            font-family:
                inherit;

            text-align:
                left;

            cursor:
                pointer;

            pointer-events:
                auto;

            opacity:
                0;

            transform:
                translateY(-18px)
                scale(.97);

            transition:
                opacity .24s ease,
                transform .24s ease;

        }


        .memora-chat-toast.show {

            opacity:
                1;

            transform:
                translateY(0)
                scale(1);

        }


        .memora-chat-toast-avatar {

            width:
                44px;

            height:
                44px;

            flex-shrink:
                0;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                50%;

            background:
                linear-gradient(
                    145deg,
                    rgba(139,92,246,.22),
                    rgba(255,255,255,.055)
                );

            border:
                1px solid
                rgba(167,139,250,.24);

            color:
                #ffffff;

            font-size:
                13px;

            font-weight:
                850;

        }


        .memora-chat-toast-content {

            flex:
                1;

            min-width:
                0;

            display:
                flex;

            flex-direction:
                column;

            gap:
                3px;

        }


        .memora-chat-toast-content strong {

            overflow:
                hidden;

            text-overflow:
                ellipsis;

            white-space:
                nowrap;

            font-size:
                12px;

            font-weight:
                800;

        }


        .memora-chat-toast-content span {

            overflow:
                hidden;

            text-overflow:
                ellipsis;

            white-space:
                nowrap;

            color:
                rgba(255,255,255,.43);

            font-size:
                10px;

        }


        .memora-chat-toast-close {

            width:
                27px;

            height:
                27px;

            flex-shrink:
                0;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                9px;

            background:
                rgba(255,255,255,.05);

            color:
                rgba(255,255,255,.45);

            font-size:
                17px;

        }


        .chat-unread-badge {

            min-width:
                19px;

            height:
                19px;

            padding:
                0 5px;

            display:
                inline-flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                999px;

            background:
                rgba(167,139,250,.20);

            border:
                1px solid
                rgba(167,139,250,.30);

            color:
                #eee8ff;

            font-size:
                8px;

            font-weight:
                850;

            line-height:
                1;

        }


        @media (max-width: 600px) {

            #memora-chat-toast-container {

                top:
                    10px;

                width:
                    calc(100vw - 20px);

            }


            .chat-unread-badge {

                min-width:
                    18px;

                height:
                    18px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}
function animateNotificationBell() {

    if (!notificationButton) {
        return;
    }


    notificationButton.classList.remove(
        "bell-active"
    );


    // Перезапускаем animation даже если
    // новое уведомление пришло подряд.

    void notificationButton.offsetWidth;


    notificationButton.classList.add(
        "bell-active"
    );


    setTimeout(
        function() {

            notificationButton.classList.remove(
                "bell-active"
            );

        },
        700
    );

}