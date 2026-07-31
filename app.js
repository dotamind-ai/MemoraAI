// =====================================================
// MEMORA APP
// MAIN PAGE
// SUPABASE
// =====================================================


// =====================================================
// SUPABASE CONFIG
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


const memoryList =
    document.getElementById("memoryList");


const typeButtons =
    document.querySelectorAll(".type-btn");



// =====================================================
// STATE
// =====================================================

let selectedType = "idea";

let currentUser = null;



// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


async function initializeApp() {


    // Получаем текущую Supabase-сессию

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (
        error ||
        !data.session
    ) {

        window.location.href =
            "welcome/welcome.html";

        return;

    }


    currentUser =
        data.session.user;


    // Настраиваем типы

    setupMemoryTypes();


    // =================================================
    // ВАЖНО
    //
    // На главной больше НЕ загружаем список Memories.
    // Все сохранённые записи показываются в Timeline.
    // =================================================

    if (memoryCount) {

        memoryCount.textContent = "0";

    }


    if (memoryList) {

        memoryList.innerHTML = "";

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
                        button.dataset.type ||
                        "idea";

                }
            );

        }
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


    // Проверяем пользователя

    if (!currentUser) {

        window.location.href =
            "welcome/welcome.html";

        return;

    }



    // Получаем текст

    const content =
        memoryInput.value.trim();



    // Пустая заметка

    if (!content) {


        showMessage(
            "Write something first"
        );


        memoryInput.focus();


        return;

    }



    // Блокируем кнопку

    saveMemoryButton.disabled =
        true;


    saveMemoryButton.textContent =
        "Saving...";



    // -------------------------------------------------
    // Создаём автоматический заголовок
    // -------------------------------------------------

    const title =
        content
            .split(/\r?\n/)[0]
            .trim()
            .slice(0, 120);



    // -------------------------------------------------
    // Сохраняем в Supabase
    // -------------------------------------------------

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



    // Ошибка

    if (error) {


        console.error(
            "Save memory error:",
            error
        );


        showMessage(
            "Unable to save memory"
        );


        restoreSaveButton();


        return;

    }



    // -------------------------------------------------
    // Успешно
    // -------------------------------------------------

    memoryInput.value = "";


    restoreSaveButton();


    showMessage(
        "Saved to Timeline"
    );



    // Небольшая пауза,
    // затем открываем Timeline

    setTimeout(
        function() {

            window.location.href =
                "events.html";

        },
        500
    );

}



// =====================================================
// RESTORE BUTTON
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


// Для HTML onclick

window.goHome =
    goHome;


window.goCalendar =
    goCalendar;


window.goEvents =
    goEvents;


window.goProfile =
    goProfile;