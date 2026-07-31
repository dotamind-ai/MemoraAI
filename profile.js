// =====================================================
// MEMORA PROFILE
// SUPABASE
// AVATAR -> COMPRESSED WEBP
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

const avatarPreview =
    document.getElementById("avatarPreview");

const avatarInput =
    document.getElementById("avatarInput");

const changeAvatarButton =
    document.getElementById(
        "changeAvatarButton"
    );

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const displayNameInput =
    document.getElementById(
        "displayNameInput"
    );

const emailValue =
    document.getElementById("emailValue");

const accountDate =
    document.getElementById("accountDate");

const profileMessage =
    document.getElementById(
        "profileMessage"
    );

const saveProfileButton =
    document.getElementById(
        "saveProfileButton"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const homeNav =
    document.getElementById("homeNav");

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

let currentProfile = null;

let selectedAvatarFile = null;


// =====================================================
// CONSTANTS
// =====================================================

// Максимальное разрешение аватара.

const AVATAR_MAX_SIZE = 512;


// Качество WebP.
// 0.8 даёт хороший баланс между качеством
// и размером.

const AVATAR_QUALITY = 0.8;


// Максимальный размер итогового файла.

// 700 KB.

const AVATAR_MAX_BYTES =
    700 * 1024;


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeProfile
);


async function initializeProfile() {

    try {

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


        renderUserEmail();

        renderAccountDate();


        await loadProfile();


        setupEvents();


    } catch (error) {

        console.error(
            "Profile initialization error:",
            error
        );

        redirectToWelcome();

    }

}


// =====================================================
// EMAIL
// =====================================================

function renderUserEmail() {

    const email =
        currentUser.email ||
        "No email";


    profileEmail.textContent =
        email;


    emailValue.textContent =
        email;

}


// =====================================================
// ACCOUNT DATE
// =====================================================

function renderAccountDate() {

    if (!currentUser.created_at) {

        accountDate.textContent =
            "—";

        return;

    }


    const date =
        new Date(
            currentUser.created_at
        );


    accountDate.textContent =
        date.toLocaleDateString(
            "ru-RU",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


// =====================================================
// LOAD PROFILE
// =====================================================

async function loadProfile() {

    const {
        data,
        error
    } = await supabaseClient

        .from("profiles")

        .select(
            "id, display_name, avatar_url, updated_at"
        )

        .eq(
            "id",
            currentUser.id
        )

        .maybeSingle();


    if (error) {

        console.error(
            "Load profile error:",
            error
        );

        applyDefaultProfile();

        showMessage(
            "Unable to load profile"
        );

        return;

    }


    if (!data) {

        currentProfile = {

            id:
                currentUser.id,

            display_name:
                "",

            avatar_url:
                null,

            updated_at:
                null

        };


        await createProfile();


        applyDefaultProfile();


        return;

    }


    currentProfile =
        data;


    applyProfileData();

}


// =====================================================
// CREATE PROFILE
// =====================================================

async function createProfile() {

    const {
        data,
        error
    } = await supabaseClient

        .from("profiles")

        .insert({

            id:
                currentUser.id,

            display_name:
                "",

            avatar_url:
                null

        })

        .select(
            "id, display_name, avatar_url, updated_at"
        )

        .single();


    if (error) {

        console.error(
            "Create profile error:",
            error
        );

        return;

    }


    currentProfile =
        data;

}


// =====================================================
// APPLY PROFILE DATA
// =====================================================

function applyDefaultProfile() {

    const email =
        currentUser.email ||
        "Member";


    const fallbackName =
        email.split("@")[0] ||
        "Member";


    displayNameInput.value =
        fallbackName;


    profileName.textContent =
        fallbackName;


    setAvatarDefault(
        fallbackName
    );

}


function applyProfileData() {

    const email =
        currentUser.email ||
        "Member";


    const savedName =
        (
            currentProfile.display_name ||
            ""
        ).trim();


    const name =
        savedName ||
        email.split("@")[0] ||
        "Member";


    displayNameInput.value =
        savedName;


    profileName.textContent =
        name;


    if (
        currentProfile.avatar_url
    ) {

        setAvatarImage(
            currentProfile.avatar_url
        );

    } else {

        setAvatarDefault(
            name
        );

    }

}


// =====================================================
// DEFAULT AVATAR
// =====================================================

function setAvatarDefault(name) {

    const letter =
        (
            name ||
            "M"
        )
        .trim()
        .charAt(0)
        .toUpperCase() ||
        "M";


    avatarPreview
        .classList.remove(
            "has-image"
        );


    avatarPreview.style.backgroundImage =
        "";


    avatarPreview.textContent =
        letter;

}


// =====================================================
// IMAGE AVATAR
// =====================================================

function setAvatarImage(url) {

    avatarPreview
        .classList.add(
            "has-image"
        );


    avatarPreview.style.backgroundImage =
        `url("${url}")`;


    avatarPreview.textContent =
        "";

}


// =====================================================
// EVENTS
// =====================================================

function setupEvents() {


    changeAvatarButton.addEventListener(
        "click",
        function() {

            avatarInput.click();

        }
    );


    avatarInput.addEventListener(
        "change",
        handleAvatarSelection
    );


    saveProfileButton.addEventListener(
        "click",
        saveProfile
    );


    displayNameInput.addEventListener(
        "input",
        function() {

            const value =
                displayNameInput.value.trim();


            if (value) {

                // Если пользователь ещё
                // не выбрал фотографию,
                // показываем первую букву имени.

                if (
                    !selectedAvatarFile &&
                    !currentProfile.avatar_url
                ) {

                    setAvatarDefault(
                        value
                    );

                }

            }

        }
    );


    logoutButton.addEventListener(
        "click",
        logout
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
// SELECT AVATAR
// =====================================================

function handleAvatarSelection(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {

        return;

    }


    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        showMessage(
            "Use JPG, PNG or WebP"
        );


        avatarInput.value =
            "";

        selectedAvatarFile =
            null;


        return;

    }


    // Ограничиваем исходный файл.
    // 15 MB достаточно даже для
    // фотографии с телефона.

    const maxInputSize =
        15 * 1024 * 1024;


    if (
        file.size >
        maxInputSize
    ) {

        showMessage(
            "Image is too large"
        );


        avatarInput.value =
            "";

        selectedAvatarFile =
            null;


        return;

    }


    selectedAvatarFile =
        file;


    // Показываем быстрый preview.

    const previewUrl =
        URL.createObjectURL(
            file
        );


    setAvatarImage(
        previewUrl
    );


    showMessage(
        "Image selected"
    );

}


// =====================================================
// COMPRESS IMAGE TO WEBP
// =====================================================

async function compressAvatar(
    file
) {

    const image =
        await loadImage(
            file
        );


    // Исходные размеры.

    const originalWidth =
        image.naturalWidth ||
        image.width;


    const originalHeight =
        image.naturalHeight ||
        image.height;


    // Центрируем квадратный crop.

    const sourceSize =
        Math.min(
            originalWidth,
            originalHeight
        );


    const sourceX =
        Math.floor(
            (
                originalWidth -
                sourceSize
            ) / 2
        );


    const sourceY =
        Math.floor(
            (
                originalHeight -
                sourceSize
            ) / 2
        );


    // Canvas.

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        AVATAR_MAX_SIZE;


    canvas.height =
        AVATAR_MAX_SIZE;


    const ctx =
        canvas.getContext(
            "2d"
        );


    if (!ctx) {

        throw new Error(
            "Canvas is not supported"
        );

    }


    // Более качественный resize.

    ctx.imageSmoothingEnabled =
        true;


    ctx.imageSmoothingQuality =
        "high";


    // Белый фон на случай,
    // если исходник имеет прозрачность.

    ctx.fillStyle =
        "#111116";


    ctx.fillRect(
        0,
        0,
        AVATAR_MAX_SIZE,
        AVATAR_MAX_SIZE
    );


    // Рисуем квадратный crop.

    ctx.drawImage(

        image,

        sourceX,
        sourceY,
        sourceSize,
        sourceSize,

        0,
        0,
        AVATAR_MAX_SIZE,
        AVATAR_MAX_SIZE

    );


    // Получаем WebP.

    let blob =
        await canvasToBlob(
            canvas,
            "image/webp",
            AVATAR_QUALITY
        );


    if (!blob) {

        throw new Error(
            "Unable to convert image"
        );

    }


    // Если WebP всё ещё слишком большой,
    // постепенно уменьшаем качество.

    let quality =
        AVATAR_QUALITY;


    while (
        blob.size >
            AVATAR_MAX_BYTES &&
        quality > .45
    ) {

        quality -= .1;


        blob =
            await canvasToBlob(
                canvas,
                "image/webp",
                quality
            );

    }


    if (
        blob.size >
        AVATAR_MAX_BYTES
    ) {

        // Последняя попытка —
        // уменьшаем canvas.

        const smallCanvas =
            document.createElement(
                "canvas"
            );


        smallCanvas.width =
            384;


        smallCanvas.height =
            384;


        const smallCtx =
            smallCanvas.getContext(
                "2d"
            );


        smallCtx.imageSmoothingEnabled =
            true;


        smallCtx.imageSmoothingQuality =
            "high";


        smallCtx.drawImage(

            canvas,

            0,
            0,
            384,
            384

        );


        blob =
            await canvasToBlob(
                smallCanvas,
                "image/webp",
                .65
            );

    }


    if (!blob) {

        throw new Error(
            "Unable to compress image"
        );

    }


    // Создаём новый File.

    return new File(

        [blob],

        "avatar.webp",

        {
            type:
                "image/webp"
        }

    );

}


// =====================================================
// LOAD IMAGE
// =====================================================

function loadImage(file) {

    return new Promise(
        function(resolve, reject) {


            const image =
                new Image();


            const url =
                URL.createObjectURL(
                    file
                );


            image.onload =
                function() {

                    URL.revokeObjectURL(
                        url
                    );


                    resolve(
                        image
                    );

                };


            image.onerror =
                function() {

                    URL.revokeObjectURL(
                        url
                    );


                    reject(
                        new Error(
                            "Unable to read image"
                        )
                    );

                };


            image.src =
                url;

        }
    );

}


// =====================================================
// CANVAS TO BLOB
// =====================================================

function canvasToBlob(
    canvas,
    type,
    quality
) {

    return new Promise(
        function(resolve) {

            canvas.toBlob(
                function(blob) {

                    resolve(
                        blob
                    );

                },
                type,
                quality
            );

        }
    );

}


// =====================================================
// UPLOAD AVATAR
// =====================================================

async function uploadAvatar(
    file
) {

    // Всегда один и тот же файл.

    const filePath =
        `${currentUser.id}/avatar.webp`;


    const {
        error
    } = await supabaseClient.storage

        .from("avatars")

        .upload(

            filePath,

            file,

            {
                cacheControl:
                    "3600",

                upsert:
                    true,

                contentType:
                    "image/webp"
            }

        );


    if (error) {

        throw error;

    }


    const {
        data
    } = supabaseClient.storage

        .from("avatars")

        .getPublicUrl(
            filePath
        );


    if (
        !data ||
        !data.publicUrl
    ) {

        throw new Error(
            "Unable to get avatar URL"
        );

    }


    // Добавляем timestamp,
    // чтобы браузер не показывал
    // старую закэшированную фотографию.

    return (
        data.publicUrl +
        "?t=" +
        Date.now()
    );

}


// =====================================================
// SAVE PROFILE
// =====================================================

async function saveProfile() {

    if (!currentUser) {

        redirectToWelcome();

        return;

    }


    const displayName =
        displayNameInput.value.trim();


    if (
        displayName.length >
        40
    ) {

        showMessage(
            "Name is too long"
        );

        return;

    }


    saveProfileButton.disabled =
        true;


    saveProfileButton.textContent =
        "Saving...";


    try {


        let avatarUrl =
            currentProfile
                ? currentProfile.avatar_url
                : null;


        // ---------------------------------------------
        // COMPRESS + UPLOAD
        // ---------------------------------------------

        if (selectedAvatarFile) {


            showMessage(
                "Compressing image..."
            );


            const compressedFile =
                await compressAvatar(
                    selectedAvatarFile
                );


            showMessage(
                "Uploading avatar..."
            );


            avatarUrl =
                await uploadAvatar(
                    compressedFile
                );

        }



        // ---------------------------------------------
        // SAVE PROFILE
        // ---------------------------------------------

        const {
            data,
            error
        } = await supabaseClient

            .from("profiles")

            .upsert({

                id:
                    currentUser.id,

                display_name:
                    displayName || null,

                avatar_url:
                    avatarUrl,

                updated_at:
                    new Date().toISOString()

            })

            .select(
                "id, display_name, avatar_url, updated_at"
            )

            .single();



        if (error) {

            throw error;

        }


        currentProfile =
            data;


        selectedAvatarFile =
            null;


        avatarInput.value =
            "";


        // Имя

        const finalName =
            displayName ||
            currentUser.email
                .split("@")[0] ||
            "Member";


        profileName.textContent =
            finalName;



        // Avatar

        if (avatarUrl) {

            setAvatarImage(
                avatarUrl
            );

        } else {

            setAvatarDefault(
                finalName
            );

        }


        showMessage(
            "Profile saved"
        );


    } catch (error) {


        console.error(
            "Save profile error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to save profile"
        );


    } finally {


        saveProfileButton.disabled =
            false;


        saveProfileButton.textContent =
            "Save changes";

    }

}


// =====================================================
// LOGOUT
// =====================================================

async function logout() {

    logoutButton.disabled =
        true;


    const strong =
        logoutButton.querySelector(
            ".logout-text strong"
        );


    if (strong) {

        strong.textContent =
            "Logging out...";

    }


    const {
        error
    } = await supabaseClient.auth.signOut();


    if (error) {


        console.error(
            "Logout error:",
            error
        );


        logoutButton.disabled =
            false;


        if (strong) {

            strong.textContent =
                "Log out";

        }


        showMessage(
            "Unable to log out"
        );


        return;

    }


    localStorage.removeItem(
        "memoraAuth"
    );


    redirectToWelcome();

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message
) {

    profileMessage.textContent =
        message;


    profileMessage.style.opacity =
        "1";


    clearTimeout(
        profileMessage._timer
    );


    profileMessage._timer =
        setTimeout(
            function() {

                profileMessage.style.opacity =
                    "0";

            },
            2500
        );

}


// =====================================================
// REDIRECT
// =====================================================

function redirectToWelcome() {

    window.location.href =
        "welcome/welcome.html";

}