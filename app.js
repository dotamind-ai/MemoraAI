// =====================================================
// MEMORA APP
// SUPABASE MEMORY SYSTEM
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


const memoryList =
    document.getElementById("memoryList");


const memoryCount =
    document.getElementById("memoryCount");


const typeButtons =
    document.querySelectorAll(".type-btn");


// =====================================================
// STATE
// =====================================================

let selectedType = "idea";

let currentUser = null;

let memories = [];


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


async function initializeApp() {

    // Проверяем текущую Supabase-сессию

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        redirectToWelcome();

        return;

    }


    // Пользователь не авторизован

    if (!data.session) {

        redirectToWelcome();

        return;

    }


    // Текущий пользователь

    currentUser =
        data.session.user;


    // Настраиваем типы

    setupMemoryTypes();


    // Загружаем Memories

    await loadMemories();


    // Следим за изменением авторизации

    supabaseClient.auth.onAuthStateChange(
        function (event, session) {

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
// REDIRECT TO WELCOME
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
        function (button) {


            button.addEventListener(
                "click",
                function () {


                    // Убираем active

                    typeButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    // Добавляем active

                    button.classList.add(
                        "active"
                    );


                    // Запоминаем выбранный тип

                    selectedType =
                        button.dataset.type ||
                        "idea";

                }
            );


        }
    );

}


// =====================================================
// LOAD MEMORIES
// =====================================================

async function loadMemories() {


    if (!currentUser) {

        return;

    }


    memoryList.innerHTML = "";


    const {
        data,
        error
    } = await supabaseClient
        .from("memories")
        .select(
            "id, user_id, type, content, created_at"
        )
        .eq(
            "user_id",
            currentUser.id
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Load memories error:",
            error
        );


        showTemporaryMessage(
            "Не удалось загрузить воспоминания"
        );


        return;

    }


    memories = data || [];


    renderMemories();

}


// =====================================================
// RENDER MEMORIES
// =====================================================

function renderMemories() {


    memoryList.innerHTML = "";


    memoryCount.textContent =
        memories.length;


    if (memories.length === 0) {

        const empty =
            document.createElement("div");


        empty.className =
            "memory-empty";


        empty.textContent =
            "No memories yet";


        memoryList.appendChild(
            empty
        );


        return;

    }


    memories.forEach(
        function (memory) {


            const card =
                createMemoryCard(
                    memory
                );


            memoryList.appendChild(
                card
            );

        }
    );

}


// =====================================================
// CREATE MEMORY CARD
// =====================================================

function createMemoryCard(memory) {


    const article =
        document.createElement("article");


    article.className =
        "memory-item";


    article.dataset.id =
        memory.id;



    // TYPE

    const type =
        document.createElement("div");


    type.className =
        "memory-type";


    type.textContent =
        String(
            memory.type || "idea"
        ).toUpperCase();



    // TEXT

    const text =
        document.createElement("div");


    text.className =
        "memory-text";


    // textContent защищает от HTML/JS

    text.textContent =
        memory.content || "";



    // FOOTER

    const footer =
        document.createElement("div");


    footer.className =
        "memory-footer";



    const date =
        document.createElement("span");


    date.textContent =
        formatDate(
            memory.created_at
        );



    // DELETE

    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "delete-memory";


    deleteButton.type =
        "button";


    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteMemory(
                memory.id
            );

        }
    );



    footer.appendChild(
        date
    );


    footer.appendChild(
        deleteButton
    );


    article.appendChild(
        type
    );


    article.appendChild(
        text
    );


    article.appendChild(
        footer
    );


    return article;

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


        showTemporaryMessage(
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



    const {
        data,
        error
    } = await supabaseClient
        .from("memories")
        .insert({

            user_id:
                currentUser.id,

            type:
                selectedType,

            content:
                content

        })
        .select(
            "id, user_id, type, content, created_at"
        )
        .single();



    if (error) {

        console.error(
            "Save memory error:",
            error
        );


        showTemporaryMessage(
            "Не удалось сохранить"
        );


        restoreSaveButton();


        return;

    }



    // Добавляем новую запись сверху

    memories.unshift(
        data
    );


    // Очищаем поле

    memoryInput.value = "";


    // Обновляем экран

    renderMemories();


    restoreSaveButton();


    showTemporaryMessage(
        "Memory saved"
    );

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
// DELETE MEMORY
// =====================================================

async function deleteMemory(memoryId) {


    if (!memoryId) {

        return;

    }


    const confirmed =
        window.confirm(
            "Delete this memory?"
        );


    if (!confirmed) {

        return;

    }



    const {
        error
    } = await supabaseClient
        .from("memories")
        .delete()
        .eq(
            "id",
            memoryId
        )
        .eq(
            "user_id",
            currentUser.id
        );



    if (error) {


        console.error(
            "Delete memory error:",
            error
        );


        showTemporaryMessage(
            "Не удалось удалить"
        );


        return;

    }



    // Удаляем из локального массива

    memories =
        memories.filter(
            function (memory) {

                return memory.id !== memoryId;

            }
        );



    // Перерисовываем

    renderMemories();


    showTemporaryMessage(
        "Memory deleted"
    );

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(dateString) {


    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleString(
        "ru-RU",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }
    );

}


// =====================================================
// TEMPORARY MESSAGE
// =====================================================

function showTemporaryMessage(
    message
) {


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
            "rgba(255,255,255,.12)";


        box.style.border =
            "1px solid rgba(255,255,255,.18)";


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
            function () {

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
