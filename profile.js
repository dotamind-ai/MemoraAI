// =====================================================
// MEMORA PROFILE
// SUPABASE
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

        showMessage(
            "Unable to load profile"
        );

        applyDefaultProfile();

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
// APPLY PROFILE
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
// AVATAR
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

                setAvatarDefault(
                    value
                );

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
// AVATAR FILE SELECTION
// =====================================================

function handleAvatarSelection(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {

        return;

    }


    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        showMessage(
            "Avatar must be smaller than 5 MB"
        );


        avatarInput.value =
            "";


        selectedAvatarFile =
            null;


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


    selectedAvatarFile =
        file;


    const previewUrl =
        URL.createObjectURL(
            file
        );


    setAvatarImage(
        previewUrl
    );


    showMessage(
        "Avatar selected"
    );

}


// =====================================================
// UPLOAD AVATAR
// =====================================================

async function uploadAvatar(file) {

    const extension =
        getFileExtension(
            file.name,
            file.type
        );


    // Один и тот же путь позволяет обновлять
    // существующий файл.

    const filePath =
        `${currentUser.id}/avatar.${extension}`;


    const {
        error
    } = await supabaseClient.storage

        .from("avatars")

        .upload(
            filePath,
            file,
            {
                cacheControl: "3600",
                upsert: true,
                contentType: file.type
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


    if (!data.publicUrl) {

        throw new Error(
            "Unable to get avatar URL"
        );

    }


    return (
        data.publicUrl +
        "?t=" +
        Date.now()
    );

}


// =====================================================
// FILE EXTENSION
// =====================================================

function getFileExtension(
    filename,
    mimeType
) {

    const filenameExtension =
        filename
            .split(".")
            .pop()
            .toLowerCase();


    if (
        [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ].includes(
            filenameExtension
        )
    ) {

        return filenameExtension;

    }


    if (
        mimeType ===
        "image/png"
    ) {

        return "png";

    }


    if (
        mimeType ===
        "image/webp"
    ) {

        return "webp";

    }


    return "jpg";

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
        displayName.length > 40
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
        // Upload selected avatar
        // ---------------------------------------------

        if (selectedAvatarFile) {

            avatarUrl =
                await uploadAvatar(
                    selectedAvatarFile
                );

        }


        // ---------------------------------------------
        // Upsert profile
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


        profileName.textContent =
            displayName ||
            currentUser.email
                .split("@")[0] ||
            "Member";


        if (avatarUrl) {

            setAvatarImage(
                avatarUrl
            );

        } else {

            setAvatarDefault(
                profileName.textContent
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

function showMessage(message) {

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