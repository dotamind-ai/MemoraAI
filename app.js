// =====================================================
// MEMORA MAIN APP
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

const memoryInput =
    document.getElementById("memoryInput");

const saveMemoryButton =
    document.getElementById("saveMemory");

const memoryCount =
    document.getElementById("memoryCount");

const ideaCount =
    document.getElementById("ideaCount");

const noteCount =
    document.getElementById("noteCount");

const inspirationCount =
    document.getElementById("inspirationCount");

const goalCount =
    document.getElementById("goalCount");

const typeButtons =
    document.querySelectorAll(".type-btn");


// =====================================================
// STATE
// =====================================================

let currentUser = null;

let selectedType = "idea";


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


async function initializeApp() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error || !data.session) {

            redirectToWelcome();

            return;

        }


        currentUser =
            data.session.user;


        localStorage.setItem(
            "memoraAuth",
            "true"
        );


        setupMemoryTypes();


        await loadMemoryStats();


        supabaseClient.auth.onAuthStateChange(
            function(event, session) {

                if (
                    event === "SIGNED_OUT" ||
                    !session
                ) {

                    localStorage.removeItem(
                        "memoraAuth"
                    );

                    redirectToWelcome();

                }

            }
        );


    } catch (error) {

        console.error(
            "Initialization error:",
            error
        );

        redirectToWelcome();

    }

}


// =====================================================
// MEMORY TYPES
// =====================================================

function setupMemoryTypes() {

    typeButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    typeButtons.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedType =
                        normalizeType(
                            button.dataset.type
                        );

                }
            );

        }
    );

}


// =====================================================
// STATS
// =====================================================

async function loadMemoryStats() {

    if (!currentUser) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("memories")
        .select("type")
        .eq(
            "user_id",
            currentUser.id
        );


    if (error) {

        console.error(
            "Memory statistics error:",
            error
        );

        return;

    }


    const stats = {
        idea: 0,
        note: 0,
        inspiration: 0,
        goal: 0
    };


    (data || []).forEach(
        function(memory) {

            const type =
                normalizeType(
                    memory.type
                );


            if (
                Object.prototype.hasOwnProperty.call(
                    stats,
                    type
                )
            ) {

                stats[type]++;

            }

        }
    );


    setStat(
        memoryCount,
        data.length
    );

    setStat(
        ideaCount,
        stats.idea
    );

    setStat(
        noteCount,
        stats.note
    );

    setStat(
        inspirationCount,
        stats.inspiration
    );

    setStat(
        goalCount,
        stats.goal
    );

}


function setStat(element, value) {

    if (element) {

        element.textContent =
            String(value);

    }

}


// =====================================================
// SAVE MEMORY
// =====================================================

saveMemoryButton.addEventListener(
    "click",
    saveMemory
);


async function saveMemory() {

    if (!currentUser) {

        redirectToWelcome();

        return;

    }


    const content =
        memoryInput.value.trim();


    if (!content) {

        showMessage(
            "Write something first"
        );

        memoryInput.focus();

        return;

    }


    saveMemoryButton.disabled =
        true;

    saveMemoryButton.textContent =
        "Saving...";


    const title =
        content
            .split(/\r?\n/)[0]
            .trim()
            .slice(0, 120);


    try {

        const {
            error
        } = await supabaseClient
            .from("memories")
            .insert({

                user_id:
                    currentUser.id,

                title:
                    title || null,

                type:
                    selectedType,

                content:
                    content

            });


        if (error) {

            throw error;

        }


        memoryInput.value = "";


        await loadMemoryStats();


        restoreSaveButton();


        showMessage(
            "Saved to Timeline"
        );


        setTimeout(
            function() {

                window.location.href =
                    "events.html";

            },
            500
        );


    } catch (error) {

        console.error(
            "Save memory error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to save memory"
        );


        restoreSaveButton();

    }

}


// =====================================================
// BUTTON
// =====================================================

function restoreSaveButton() {

    saveMemoryButton.disabled =
        false;

    saveMemoryButton.textContent =
        "Save Memory";

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(message) {

    let box =
        document.getElementById(
            "memoraMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "memoraMessage";


        box.style.position =
            "fixed";

        box.style.left =
            "50%";

        box.style.bottom =
            "105px";

        box.style.transform =
            "translateX(-50%)";

        box.style.padding =
            "10px 18px";

        box.style.borderRadius =
            "20px";

        box.style.background =
            "rgba(255,255,255,.10)";

        box.style.border =
            "1px solid rgba(255,255,255,.16)";

        box.style.backdropFilter =
            "blur(15px)";

        box.style.color =
            "white";

        box.style.fontSize =
            "13px";

        box.style.zIndex =
            "1000";

        box.style.transition =
            "opacity .25s ease";


        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;


    box.style.opacity =
        "1";


    clearTimeout(
        box._timer
    );


    box._timer =
        setTimeout(
            function() {

                box.style.opacity =
                    "0";

            },
            2200
        );

}


// =====================================================
// TYPE
// =====================================================

function normalizeType(type) {

    const value =
        String(
            type || "idea"
        ).toLowerCase();


    if (
        value === "idea" ||
        value === "note" ||
        value === "inspiration" ||
        value === "goal"
    ) {

        return value;

    }


    return "idea";

}


// =====================================================
// NAVIGATION
// =====================================================

function goHome() {

    window.location.href =
        "index.html";

}


function goCalendar() {

    window.location.href =
        "calendar.html";

}


function goEvents() {

    window.location.href =
        "events.html";

}


function goChats() {

    window.location.href =
        "chat.html";

}


function goProfile() {

    window.location.href =
        "profile.html";

}


window.goHome =
    goHome;

window.goCalendar =
    goCalendar;

window.goEvents =
    goEvents;

window.goChats =
    goChats;

window.goProfile =
    goProfile;


// =====================================================
// END
// =====================================================