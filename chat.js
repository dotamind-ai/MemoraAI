// =====================================================
// MEMORA CHATS
// FRIEND SYSTEM
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

let requests = [];


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeChats
);


async function initializeChats() {

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

    await loadFriends();

    await loadRequests();

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
        function(
            event,
            session
        ) {

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


        const user =
            data[0];


        renderSearchResult(
            user
        );


    } catch (error) {

        console.error(
            "User search error:",
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

function renderSearchResult(user) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "person-card";


    const avatar =
        createAvatar(
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


    const email =
        document.createElement(
            "span"
        );


    email.className =
        "person-email";


    email.textContent =
        emailSearch.value.trim();


    info.appendChild(name);

    info.appendChild(email);


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
// LOAD FRIENDS
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


// =====================================================
// LOAD REQUESTS
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


// =====================================================
// RENDER REQUESTS
// =====================================================

function renderRequests() {

    requestList.innerHTML =
        "";


    requestCount.textContent =
        requests.length;


    if (
        requests.length === 0
    ) {

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
                createAvatar(
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
// RESPOND TO REQUEST
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
// RENDER FRIENDS
// =====================================================

function renderFriends() {

    friendList.innerHTML =
        "";


    friendCount.textContent =
        friends.length;


    if (
        friends.length === 0
    ) {

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
                createAvatar(
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

                    alert(
                        "Chat will be connected next."
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
// AVATAR
// =====================================================

function createAvatar(
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
            (
                name ||
                "M"
            )
            .trim()
            .charAt(0)
            .toUpperCase() ||
            "M";

    }


    return avatar;

}


// =====================================================
// REDIRECT
// =====================================================

function redirectToWelcome() {

    window.location.href =
        "welcome/welcome.html";

}