// =====================================================
// MEMORA CALENDAR
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

const monthName =
    document.getElementById("monthName");

const memoryMonthCount =
    document.getElementById("memoryMonthCount");

const calendarGrid =
    document.getElementById("calendarGrid");

const selectedDateElement =
    document.getElementById("selectedDate");

const selectedCount =
    document.getElementById("selectedCount");

const dayMemories =
    document.getElementById("dayMemories");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const todayButton =
    document.getElementById("todayButton");

const backButton =
    document.getElementById("backButton");

const homeNav =
    document.getElementById("homeNav");

const timelineNav =
    document.getElementById("timelineNav");

const chatNav =
    document.getElementById("chatNav");


// =====================================================
// STATE
// =====================================================

let currentUser = null;

let memories = [];

let currentMonth = new Date();

let selectedDate = null;


currentMonth =
    new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );


// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeCalendar
);


async function initializeCalendar() {

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


    setupNavigation();


    await loadMemories();


    renderCalendar();


    selectedDate =
        makeDateKey(
            new Date()
        );


    renderSelectedDay();

}


// =====================================================
// LOAD MEMORIES
// =====================================================

async function loadMemories() {

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
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Calendar memories error:",
            error
        );

        memories = [];

        return;

    }


    memories =
        data || [];

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {


    previousMonth.addEventListener(
        "click",
        function() {

            currentMonth =
                new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                );

            selectedDate = null;

            renderCalendar();

            renderSelectedDay();

        }
    );


    nextMonth.addEventListener(
        "click",
        function() {

            currentMonth =
                new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                );

            selectedDate = null;

            renderCalendar();

            renderSelectedDay();

        }
    );


    todayButton.addEventListener(
        "click",
        function() {

            const today =
                new Date();

            currentMonth =
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );

            selectedDate =
                makeDateKey(today);

            renderCalendar();

            renderSelectedDay();

        }
    );


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


    timelineNav.addEventListener(
        "click",
        function() {

            window.location.href =
                "events.html";

        }
    );


    chatNav.addEventListener(
        "click",
        function() {

            window.location.href =
                "chat.html";

        }
    );


    supabaseClient.auth.onAuthStateChange(
        function(event, session) {

            if (
                event === "SIGNED_OUT" ||
                !session
            ) {

                window.location.href =
                    "welcome/welcome.html";

            }

        }
    );

}


// =====================================================
// CALENDAR
// =====================================================

function renderCalendar() {

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();


    monthName.textContent =
        currentMonth.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const monthMemories =
        memories.filter(
            function(memory) {

                const date =
                    new Date(
                        memory.created_at
                    );

                return (
                    date.getFullYear() === year &&
                    date.getMonth() === month
                );

            }
        );


    memoryMonthCount.textContent =
        monthMemories.length +
        (
            monthMemories.length === 1
                ? " memory"
                : " memories"
        );


    calendarGrid.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    let startDay =
        firstDay.getDay();


    startDay =
        startDay === 0
            ? 6
            : startDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    const totalCells =
        Math.ceil(
            (
                startDay +
                daysInMonth
            ) / 7
        ) * 7;


    for (
        let index = 0;
        index < totalCells;
        index++
    ) {

        let dayNumber;

        let cellDate;

        let isOtherMonth =
            false;


        if (
            index < startDay
        ) {

            dayNumber =
                previousMonthDays -
                startDay +
                index +
                1;

            cellDate =
                new Date(
                    year,
                    month - 1,
                    dayNumber
                );

            isOtherMonth = true;


        } else if (
            index >=
            startDay + daysInMonth
        ) {

            dayNumber =
                index -
                startDay -
                daysInMonth +
                1;

            cellDate =
                new Date(
                    year,
                    month + 1,
                    dayNumber
                );

            isOtherMonth = true;


        } else {

            dayNumber =
                index -
                startDay +
                1;

            cellDate =
                new Date(
                    year,
                    month,
                    dayNumber
                );

        }


        const key =
            makeDateKey(
                cellDate
            );


        const dayItems =
            getMemoriesForDate(
                key
            );


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "calendar-day";


        if (isOtherMonth) {

            button.classList.add(
                "other-month"
            );

        }


        if (
            isToday(cellDate)
        ) {

            button.classList.add(
                "today"
            );

        }


        if (
            selectedDate === key
        ) {

            button.classList.add(
                "selected"
            );

        }


        const number =
            document.createElement(
                "span"
            );

        number.className =
            "day-number";

        number.textContent =
            dayNumber;


        button.appendChild(
            number
        );


        if (
            dayItems.length
        ) {

            const dots =
                document.createElement(
                    "div"
                );

            dots.className =
                "day-dots";


            const types =
                [
                    ...new Set(
                        dayItems.map(
                            function(memory) {

                                return normalizeType(
                                    memory.type
                                );

                            }
                        )
                    )
                ];


            types
                .slice(0, 4)
                .forEach(
                    function(type) {

                        const dot =
                            document.createElement(
                                "span"
                            );

                        dot.className =
                            "day-dot " +
                            type;

                        dots.appendChild(
                            dot
                        );

                    }
                );


            button.appendChild(
                dots
            );

        }


        button.addEventListener(
            "click",
            function() {

                selectedDate =
                    key;

                renderCalendar();

                renderSelectedDay();

            }
        );


        calendarGrid.appendChild(
            button
        );

    }

}


// =====================================================
// SELECTED DAY
// =====================================================

function renderSelectedDay() {

    if (!selectedDate) {

        selectedDateElement.textContent =
            "Choose a day";

        selectedCount.textContent =
            "0";

        return;

    }


    const date =
        parseDateKey(
            selectedDate
        );


    selectedDateElement.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const items =
        getMemoriesForDate(
            selectedDate
        );


    selectedCount.textContent =
        items.length;


    if (!items.length) {

        dayMemories.innerHTML = `
            <div class="day-empty">

                <div class="empty-icon">
                    ◇
                </div>

                <div class="empty-title">
                    Nothing saved this day
                </div>

                <div class="empty-text">
                    Create a memory on the main page and it will appear here.
                </div>

            </div>
        `;

        return;

    }


    dayMemories.innerHTML = "";


    items.forEach(
        function(memory) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "day-memory";


            const type =
                document.createElement(
                    "span"
                );


            type.className =
                "day-memory-type " +
                normalizeType(
                    memory.type
                );


            const body =
                document.createElement(
                    "div"
                );


            body.className =
                "day-memory-body";


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "day-memory-title";


            title.textContent =
                memory.title ||
                "Untitled memory";


            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "day-memory-content";


            content.textContent =
                memory.content ||
                "";


            const time =
                document.createElement(
                    "span"
                );


            time.className =
                "day-memory-time";


            time.textContent =
                formatTime(
                    memory.created_at
                );


            body.appendChild(
                title
            );

            body.appendChild(
                content
            );


            item.appendChild(
                type
            );

            item.appendChild(
                body
            );

            item.appendChild(
                time
            );


            item.addEventListener(
                "click",
                function() {

                    window.location.href =
                        "events.html";

                }
            );


            dayMemories.appendChild(
                item
            );

        }
    );

}


// =====================================================
// HELPERS
// =====================================================

function getMemoriesForDate(
    dateKey
) {

    return memories.filter(
        function(memory) {

            return (
                makeDateKey(
                    new Date(
                        memory.created_at
                    )
                ) === dateKey
            );

        }
    );

}


function makeDateKey(date) {

    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(2, "0"),
        String(
            date.getDate()
        ).padStart(2, "0")
    ].join("-");

}


function parseDateKey(key) {

    const parts =
        key.split("-");


    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}


function isToday(date) {

    const today =
        new Date();


    return (
        date.getFullYear() ===
            today.getFullYear() &&

        date.getMonth() ===
            today.getMonth() &&

        date.getDate() ===
            today.getDate()
    );

}


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