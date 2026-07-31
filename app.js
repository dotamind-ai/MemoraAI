// =====================================================
// MEMORA MAIN APP
// app.js
// =====================================================


// =====================================================
// SUPABASE CONFIG
// =====================================================

const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


// =====================================================
// SUPABASE CLIENT
// =====================================================

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
// INITIALIZATION
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


        if (error) {

            console.error(
                "Supabase session error:",
                error
            );

            redirectToWelcome();

            return;
        }


        if (!data.session) {

            redirectToWelcome();

            return;
        }


        currentUser =
            data.session.user;


        // Поддерживаем старый флаг,
        // чтобы существующая защита index.html
        // продолжала работать.

        localStorage.setItem(
            "memoraAuth",
            "true"
        );


        setupMemoryTypes();


        await loadMemoryStats();


        // Следим за выходом из аккаунта

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
// REDIRECT
// =====================================================

function redirectToWelcome() {

    window.location.href =
        "welcome/welcome.html";

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
// NORMALIZE TYPE
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
// LOAD MEMORY STATISTICS
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


        setStat(
            memoryCount,
            0
        );

        setStat(
            ideaCount,
            0
        );

        setStat(
            noteCount,
            0
        );

        setStat(
            inspirationCount,
            0
        );

        setStat(
            goalCount,
            0
        );

        return;
    }


    const rows =
        data || [];


    const stats = {

        idea: 0,

        note: 0,

        inspiration: 0,

        goal: 0

    };


    rows.forEach(
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
        rows.length
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


// =====================================================
// SET STATISTIC VALUE
// =====================================================

function setStat(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        String(
            value
        );

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


    // Автоматически делаем заголовок
    // из первой строки текста.

    const title =
        content
            .split(/\r?\n/)[0]
            .trim()
            .slice(0, 120);


    try {

        const {
            data,
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

            })
            .select(
                "id, user_id, title, type, content, created_at"
            )
            .single();


        if (error) {

            console.error(
                "Save memory error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to save memory"
            );


            restoreSaveButton();

            return;
        }


        // Очищаем поле.

        memoryInput.value = "";


        // Обновляем статистику.

        await loadMemoryStats();


        restoreSaveButton();


        showMessage(
            "Saved to Timeline"
        );


        // После создания сразу открываем
        // третью вкладку.

        setTimeout(
            function() {

                window.location.href =
                    "events.html";

            },
            500
        );


    } catch (error) {

        console.error(
            "Unexpected save error:",
            error
        );


        showMessage(
            "Unable to save memory"
        );


        restoreSaveButton();

    }

}


// =====================================================
// RESTORE SAVE BUTTON
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


function goProfile() {

    window.location.href =
        "profile.html";

}


// Делаем функции доступными
// для onclick в index.html.

window.goHome =
    goHome;

window.goCalendar =
    goCalendar;

window.goEvents =
    goEvents;

window.goProfile =
    goProfile;