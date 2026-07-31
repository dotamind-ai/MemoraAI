// =====================================================
// MEMORA TIMELINE
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
// ELEMENTS
// =====================================================

const timelineList =
    document.getElementById("timelineList");


const timelineCount =
    document.getElementById("timelineCount");


const searchInput =
    document.getElementById("searchInput");


const filterButtons =
    document.querySelectorAll(".filter-button");


const editModal =
    document.getElementById("editModal");


const closeModal =
    document.getElementById("closeModal");


const editTitle =
    document.getElementById("editTitle");


const editType =
    document.getElementById("editType");


const editContent =
    document.getElementById("editContent");


const editMessage =
    document.getElementById("editMessage");


const saveEditButton =
    document.getElementById("saveEditButton");


const deleteButton =
    document.getElementById("deleteButton");


const backButton =
    document.getElementById("backButton");


// Bottom nav

const homeNav =
    document.getElementById("homeNav");


const calendarNav =
    document.getElementById("calendarNav");


const profileNav =
    document.getElementById("profileNav");


// =====================================================
// STATE
// =====================================================

let currentUser = null;

let memories = [];

let currentFilter = "all";

let currentSearch = "";

let editingMemoryId = null;


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeTimeline
);


async function initializeTimeline() {


    const {
        data,
        error
    } = await supabaseClient.auth.getUser();


    if (
        error ||
        !data.user
    ) {

        window.location.href =
            "welcome/welcome.html";

        return;

    }


    currentUser =
        data.user;


    setupEvents();

    await loadMemories();

}


// =====================================================
// SETUP EVENTS
// =====================================================

function setupEvents() {


    searchInput.addEventListener(
        "input",
        function () {

            currentSearch =
                searchInput.value
                    .trim()
                    .toLowerCase();

            renderTimeline();

        }
    );



    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    renderTimeline();

                }
            );

        }
    );



    closeModal.addEventListener(
        "click",
        closeEditor
    );



    editModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === editModal
            ) {

                closeEditor();

            }

        }
    );



    saveEditButton.addEventListener(
        "click",
        saveEditedMemory
    );



    deleteButton.addEventListener(
        "click",
        deleteEditedMemory
    );



    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );



    homeNav.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );



    calendarNav.addEventListener(
        "click",
        function () {

            window.location.href =
                "calendar.html";

        }
    );



    profileNav.addEventListener(
        "click",
        function () {

            window.location.href =
                "profile.html";

        }
    );



    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeEditor();

            }

        }
    );


}


// =====================================================
// LOAD MEMORIES
// =====================================================

async function loadMemories() {


    timelineList.innerHTML = `
        <div class="timeline-loading">
            <div class="loading-ring"></div>
            <span>Loading memories...</span>
        </div>
    `;


    const {
        data,
        error
    } = await supabaseClient
        .from("memories")
        .select(
            "id, user_id, title, type, content, created_at"
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
            "Timeline load error:",
            error
        );


        timelineList.innerHTML = `
            <div class="timeline-empty">

                <div class="empty-icon">
                    !
                </div>

                <div class="empty-title">
                    Unable to load memories
                </div>

                <div class="empty-text">
                    Please refresh the page and try again.
                </div>

            </div>
        `;


        return;

    }


    memories =
        data || [];


    renderTimeline();

}


// =====================================================
// FILTER
// =====================================================

function getFilteredMemories() {


    return memories.filter(
        function (memory) {


            const filterMatches =
                currentFilter === "all" ||
                memory.type === currentFilter;



            if (!filterMatches) {

                return false;

            }



            if (!currentSearch) {

                return true;

            }



            const title =
                (
                    memory.title || ""
                ).toLowerCase();


            const content =
                (
                    memory.content || ""
                ).toLowerCase();


            return (
                title.includes(currentSearch) ||
                content.includes(currentSearch) ||
                String(memory.type || "")
                    .toLowerCase()
                    .includes(currentSearch)
            );

        }
    );

}


// =====================================================
// RENDER
// =====================================================

function renderTimeline() {


    const filtered =
        getFilteredMemories();


    timelineCount.textContent =
        filtered.length;



    if (filtered.length === 0) {


        timelineList.innerHTML = `
            <div class="timeline-empty">

                <div class="empty-icon">
                    ◇
                </div>

                <div class="empty-title">
                    ${
                        memories.length === 0
                        ? "Your timeline is empty"
                        : "Nothing found"
                    }
                </div>

                <div class="empty-text">

                    ${
                        memories.length === 0
                        ? "Create a memory on the main page and it will appear here."
                        : "Try another search or filter."
                    }

                </div>

            </div>
        `;


        return;

    }



    const grouped =
        groupByDay(filtered);


    timelineList.innerHTML = "";



    Object.keys(grouped).forEach(
        function (dayKey) {


            const daySection =
                document.createElement(
                    "section"
                );


            daySection.className =
                "timeline-day";



            const dayLabel =
                document.createElement(
                    "div"
                );


            dayLabel.className =
                "day-label";


            dayLabel.textContent =
                formatDayLabel(
                    dayKey
                );


            daySection.appendChild(
                dayLabel
            );



            grouped[dayKey].forEach(
                function (memory) {


                    const card =
                        createMemoryCard(
                            memory
                        );


                    daySection.appendChild(
                        card
                    );


                }
            );



            timelineList.appendChild(
                daySection
            );

        }
    );

}


// =====================================================
// GROUP BY DAY
// =====================================================

function groupByDay(items) {


    const groups = {};



    items.forEach(
        function (memory) {


            const date =
                new Date(
                    memory.created_at
                );


            const key =
                [
                    date.getFullYear(),
                    String(
                        date.getMonth() + 1
                    ).padStart(2, "0"),
                    String(
                        date.getDate()
                    ).padStart(2, "0")
                ].join("-");



            if (!groups[key]) {

                groups[key] = [];

            }



            groups[key].push(
                memory
            );

        }
    );


    return groups;

}


// =====================================================
// DAY LABEL
// =====================================================

function formatDayLabel(dayKey) {


    const date =
        new Date(
            dayKey + "T00:00:00"
        );


    const today =
        new Date();


    const yesterday =
        new Date();


    yesterday.setDate(
        today.getDate() - 1
    );



    if (
        date.toDateString() ===
        today.toDateString()
    ) {

        return "TODAY";

    }



    if (
        date.toDateString() ===
        yesterday.toDateString()
    ) {

        return "YESTERDAY";

    }



    return date.toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).toUpperCase();

}


// =====================================================
// CREATE CARD
// =====================================================

function createMemoryCard(memory) {


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "memory-card";


    card.dataset.id =
        memory.id;



    // ---------------------------
    // TOP
    // ---------------------------

    const top =
        document.createElement(
            "div"
        );


    top.className =
        "memory-top";



    const type =
        document.createElement(
            "span"
        );


    type.className =
        "memory-type";


    const normalizedType =
        normalizeType(
            memory.type
        );


    type.classList.add(
        "type-" +
        normalizedType
    );


    type.textContent =
        normalizedType.toUpperCase();



    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "memory-actions";



    const editButton =
        document.createElement(
            "button"
        );


    editButton.className =
        "card-action";


    editButton.type =
        "button";


    editButton.textContent =
        "✎";


    editButton.title =
        "Edit";


    editButton.addEventListener(
        "click",
        function () {

            openEditor(
                memory
            );

        }
    );



    const deleteAction =
        document.createElement(
            "button"
        );


    deleteAction.className =
        "card-action delete";


    deleteAction.type =
        "button";


    deleteAction.textContent =
        "×";


    deleteAction.title =
        "Delete";


    deleteAction.addEventListener(
        "click",
        function () {

            deleteMemory(
                memory.id
            );

        }
    );



    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteAction
    );



    top.appendChild(
        type
    );


    top.appendChild(
        actions
    );


    card.appendChild(
        top
    );



    // ---------------------------
    // TITLE
    // ---------------------------

    if (memory.title) {


        const title =
            document.createElement(
                "h2"
            );


        title.className =
            "memory-title";


        title.textContent =
            memory.title;


        card.appendChild(
            title
        );

    }



    // ---------------------------
    // CONTENT
    // ---------------------------

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "memory-content";


    content.textContent =
        memory.content || "";


    card.appendChild(
        content
    );



    // ---------------------------
    // FOOTER
    // ---------------------------

    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "memory-footer";



    const date =
        document.createElement(
            "span"
        );


    date.textContent =
        formatTime(
            memory.created_at
        );


    footer.appendChild(
        date
    );


    card.appendChild(
        footer
    );



    return card;

}


// =====================================================
// NORMALIZE TYPE
// =====================================================

function normalizeType(type) {


    const value =
        String(
            type || "note"
        ).toLowerCase();


    if (
        [
            "idea",
            "note",
            "inspiration",
            "goal"
        ].includes(value)
    ) {

        return value;

    }


    return "note";

}


// =====================================================
// TIME
// =====================================================

function formatTime(dateString) {


    const date =
        new Date(
            dateString
        );


    return date.toLocaleTimeString(
        "ru-RU",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================================
// OPEN EDITOR
// =====================================================

function openEditor(memory) {


    editingMemoryId =
        memory.id;


    editTitle.value =
        memory.title || "";


    editType.value =
        normalizeType(
            memory.type
        );


    editContent.value =
        memory.content || "";


    editMessage.textContent =
        "";


    editModal.classList.add(
        "show"
    );


    setTimeout(
        function () {

            editTitle.focus();

        },
        100
    );

}


// =====================================================
// CLOSE EDITOR
// =====================================================

function closeEditor() {


    editingMemoryId =
        null;


    editModal.classList.remove(
        "show"
    );


    editMessage.textContent =
        "";

}


// =====================================================
// SAVE EDIT
// =====================================================

async function saveEditedMemory() {


    if (!editingMemoryId) {

        return;

    }


    const title =
        editTitle.value.trim();


    const type =
        editType.value;


    const content =
        editContent.value.trim();



    if (!content) {


        editMessage.textContent =
            "Content cannot be empty.";


        return;

    }



    saveEditButton.disabled =
        true;


    saveEditButton.textContent =
        "Saving...";



    const {
        data,
        error
    } = await supabaseClient

        .from("memories")

        .update({

            title:
                title || null,

            type:
                type,

            content:
                content

        })

        .eq(
            "id",
            editingMemoryId
        )

        .eq(
            "user_id",
            currentUser.id
        )

        .select(
            "id, user_id, title, type, content, created_at"
        )

        .single();



    if (error) {


        console.error(
            "Update memory error:",
            error
        );


        editMessage.textContent =
            error.message;


        saveEditButton.disabled =
            false;


        saveEditButton.textContent =
            "Save changes";


        return;

    }



    // Обновляем локальный массив

    memories =
        memories.map(
            function (memory) {

                if (
                    memory.id ===
                    editingMemoryId
                ) {

                    return data;

                }

                return memory;

            }
        );



    renderTimeline();


    closeEditor();


    saveEditButton.disabled =
        false;


    saveEditButton.textContent =
        "Save changes";

}


// =====================================================
// DELETE FROM EDITOR
// =====================================================

async function deleteEditedMemory() {


    if (!editingMemoryId) {

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
            editingMemoryId
        )

        .eq(
            "user_id",
            currentUser.id
        );



    if (error) {


        console.error(
            "Delete error:",
            error
        );


        editMessage.textContent =
            error.message;


        return;

    }



    memories =
        memories.filter(
            function (memory) {

                return (
                    memory.id !==
                    editingMemoryId
                );

            }
        );


    renderTimeline();


    closeEditor();

}


// =====================================================
// DELETE FROM CARD
// =====================================================

async function deleteMemory(memoryId) {


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


        alert(
            error.message
        );


        return;

    }



    memories =
        memories.filter(
            function (memory) {

                return (
                    memory.id !==
                    memoryId
                );

            }
        );


    renderTimeline();

}


// =====================================================
// NAVIGATION
// =====================================================

window.goHome = function () {

    window.location.href =
        "index.html";

};


window.goCalendar = function () {

    window.location.href =
        "calendar.html";

};


window.goProfile = function () {

    window.location.href =
        "profile.html";

};