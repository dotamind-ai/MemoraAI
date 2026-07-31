// =====================================================
// MEMORA GLOBAL NOTIFICATIONS
// =====================================================
// Отвечает только за:
// - новые сообщения
// - всплывающие уведомления сверху
//
// Не управляет чатами, друзьями и профилем.
// =====================================================


const MEMORA_SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";

const MEMORA_SUPABASE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


// =====================================================
// SUPABASE
// =====================================================

const memoraSupabase =
    window.supabase.createClient(
        MEMORA_SUPABASE_URL,
        MEMORA_SUPABASE_KEY
    );


// =====================================================
// STATE
// =====================================================

let memoraNotificationUser = null;

let memoraNotificationChannel = null;

let memoraToastContainer = null;


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initGlobalNotifications
);


async function initGlobalNotifications() {

    try {

        // На странице Chats у нас уже есть
        // собственная система уведомлений chat.js.
        // Чтобы не получить две одинаковые всплывашки,
        // глобальный listener там не запускаем.

        if (isChatPage()) {

            return;

        }


        const {
            data,
            error
        } =
            await memoraSupabase
                .auth
                .getSession();


        if (error) {

            console.error(
                "Global notifications session error:",
                error
            );

            return;

        }


        if (
            !data ||
            !data.session
        ) {

            return;

        }


        memoraNotificationUser =
            data.session.user;


        createToastContainer();

        injectToastStyles();

        subscribeToGlobalNotifications();


    } catch (error) {

        console.error(
            "Global notification error:",
            error
        );

    }

}


// =====================================================
// CHECK PAGE
// =====================================================

function isChatPage() {

    const file =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    return (
        file === "chat.html"
    );

}


// =====================================================
// REALTIME
// =====================================================

function subscribeToGlobalNotifications() {

    if (
        !memoraNotificationUser
    ) {

        return;

    }


    if (
        memoraNotificationChannel
    ) {

        memoraSupabase
            .removeChannel(
                memoraNotificationChannel
            );

    }


    memoraNotificationChannel =
        memoraSupabase

            .channel(
                "global-notifications-" +
                memoraNotificationUser.id
            )

            .on(
                "postgres_changes",
                {
                    event: "INSERT",

                    schema: "public",

                    table: "notifications",

                    filter:
                        "user_id=eq." +
                        memoraNotificationUser.id
                },

                function(payload) {

                    handleGlobalNotification(
                        payload.new
                    );

                }

            )

            .subscribe(

                function(status) {

                    if (
                        status ===
                        "SUBSCRIBED"
                    ) {

                        console.log(
                            "Memora global notifications connected"
                        );

                    }

                }

            );

}


// =====================================================
// HANDLE
// =====================================================

function handleGlobalNotification(
    notification
) {

    if (
        !notification
    ) {

        return;

    }


    // Нас интересуют сообщения.
    // Заявки остаются в колокольчике.

    if (
        notification.type !==
        "new_message"
    ) {

        return;

    }


    showMessageToast(
        notification
    );

}


// =====================================================
// TOAST CONTAINER
// =====================================================

function createToastContainer() {

    if (
        memoraToastContainer
    ) {

        return;

    }


    memoraToastContainer =
        document.createElement(
            "div"
        );


    memoraToastContainer.id =
        "memora-global-toast-container";


    document.body.appendChild(
        memoraToastContainer
    );

}


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessageToast(
    notification
) {

    if (
        !memoraToastContainer
    ) {

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
        "memora-global-toast";


    // =================================================
    // AVATAR
    // =================================================

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "memora-global-toast-avatar";


    avatar.textContent =
        getInitial(
            sender
        );


    // =================================================
    // CONTENT
    // =================================================

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "memora-global-toast-content";


    const name =
        document.createElement(
            "strong"
        );


    name.textContent =
        sender;


    const text =
        document.createElement(
            "span"
        );


    text.textContent =
        truncate(
            message,
            100
        );


    content.appendChild(
        name
    );


    content.appendChild(
        text
    );


    // =================================================
    // CLOSE
    // =================================================

    const close =
        document.createElement(
            "span"
        );


    close.className =
        "memora-global-toast-close";


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


    // =================================================
    // BUILD
    // =================================================

    toast.appendChild(
        avatar
    );


    toast.appendChild(
        content
    );


    toast.appendChild(
        close
    );


    // =================================================
    // CLICK
    // =================================================

    toast.addEventListener(
        "click",
        function() {

            openMessageFromToast(
                notification
            );

        }
    );


    memoraToastContainer.appendChild(
        toast
    );


    // Animation

    requestAnimationFrame(
        function() {

            toast.classList.add(
                "show"
            );

        }
    );


    // Auto remove

    window.setTimeout(
        function() {

            removeToast(
                toast
            );

        },
        5000
    );

}


// =====================================================
// OPEN MESSAGE
// =====================================================

function openMessageFromToast(
    notification
) {

    if (
        !notification ||
        !notification.related_id
    ) {

        return;

    }


    // related_id у new_message =
    // conversation_id.

    const url =
        "chat.html?conversation=" +
        encodeURIComponent(
            notification.related_id
        );


    window.location.href =
        url;

}


// =====================================================
// REMOVE TOAST
// =====================================================

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


    window.setTimeout(
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
// PARSE SENDER
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


// =====================================================
// PARSE MESSAGE
// =====================================================

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


// =====================================================
// INITIAL
// =====================================================

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
// TRUNCATE
// =====================================================

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


// =====================================================
// STYLES
// =====================================================

function injectToastStyles() {

    if (
        document.getElementById(
            "memora-global-toast-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "memora-global-toast-styles";


    style.textContent = `

        #memora-global-toast-container {

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

            z-index: 999999;

            display:
                flex;

            flex-direction:
                column;

            gap: 8px;

            pointer-events:
                none;

        }


        .memora-global-toast {

            width: 100%;

            min-height: 68px;

            display:
                flex;

            align-items:
                center;

            gap: 11px;

            padding:
                9px 10px;

            border:
                1px solid
                rgba(255,255,255,.12);

            border-radius:
                18px;

            background:
                rgba(17,17,22,.96);

            color:
                #ffffff;

            box-shadow:

                0 22px 65px
                rgba(0,0,0,.45),

                0 0 35px
                rgba(139,92,246,.10);

            backdrop-filter:
                blur(25px);

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;

            text-align:
                left;

            cursor:
                pointer;

            pointer-events:
                auto;

            opacity:
                0;

            transform:
                translateY(-20px)
                scale(.97);

            transition:

                opacity .24s ease,

                transform .24s ease;

        }


        .memora-global-toast.show {

            opacity:
                1;

            transform:
                translateY(0)
                scale(1);

        }


        .memora-global-toast-avatar {

            width:
                45px;

            height:
                45px;

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


        .memora-global-toast-content {

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


        .memora-global-toast-content strong {

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


        .memora-global-toast-content span {

            overflow:
                hidden;

            text-overflow:
                ellipsis;

            white-space:
                nowrap;

            color:
                rgba(255,255,255,.44);

            font-size:
                10px;

        }


        .memora-global-toast-close {

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


        @media (max-width: 600px) {

            #memora-global-toast-container {

                top:
                    10px;

                width:
                    calc(100vw - 20px);

            }

        }

    `;


    document.head.appendChild(
        style
    );

}