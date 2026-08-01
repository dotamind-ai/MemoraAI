// =====================================================
// MEMORA PROFILE
// Supabase + Profile + Avatar + Logout
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


const avatarPreview =
    document.getElementById(
        "avatarPreview"
    );


const avatarInput =
    document.getElementById(
        "avatarInput"
    );


const changeAvatarButton =
    document.getElementById(
        "changeAvatarButton"
    );


const profileName =
    document.getElementById(
        "profileName"
    );


const profileEmail =
    document.getElementById(
        "profileEmail"
    );


const displayNameInput =
    document.getElementById(
        "displayNameInput"
    );


const emailValue =
    document.getElementById(
        "emailValue"
    );


const accountDate =
    document.getElementById(
        "accountDate"
    );


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


// Навигация

const homeNav =
    document.getElementById(
        "homeNav"
    );


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


let currentUser =
    null;


let currentProfile =
    null;


let selectedAvatarFile =
    null;




// =====================================================
// START
// =====================================================


document.addEventListener(
    "DOMContentLoaded",
    initializeProfile
);



async function initializeProfile(){


    try{


        const {
            data,
            error
        } =
        await supabaseClient.auth.getUser();



        if(
            error ||
            !data.user
        ){

            redirectToWelcome();

            return;

        }



        currentUser =
            data.user;



        renderEmail();


        renderAccountDate();


        await loadProfile();


        setupEvents();



    }
    catch(error){


        console.error(
            "Profile start error:",
            error
        );


    }


}




// =====================================================
// EMAIL
// =====================================================


function renderEmail(){


    const email =
        currentUser.email ||
        "No email";



    if(profileEmail){

        profileEmail.textContent =
            email;

    }



    if(emailValue){

        emailValue.textContent =
            email;

    }


}




// =====================================================
// DATE
// =====================================================


function renderAccountDate(){


    if(
        !accountDate ||
        !currentUser.created_at
    ){

        return;

    }



    accountDate.textContent =
        new Date(
            currentUser.created_at
        )
        .toLocaleDateString(
            "ru-RU"
        );


}
// =====================================================
// LOAD PROFILE
// =====================================================


async function loadProfile(){


    const {
        data,
        error
    } =
    await supabaseClient
        .from("profiles")
        .select(
            "id,display_name,avatar_url,updated_at"
        )
        .eq(
            "id",
            currentUser.id
        )
        .maybeSingle();



    if(error){


        console.error(
            "Load profile error:",
            error
        );


        return;

    }




    if(!data){


        const {
            data:newProfile,
            error:createError
        } =
        await supabaseClient
            .from("profiles")
            .insert({

                id:
                    currentUser.id,

                display_name:
                    "",

                avatar_url:
                    null,

                is_online:
                    true,

                last_seen:
                    new Date().toISOString()

            })
            .select()
            .single();



        if(createError){

            console.error(
                "Create profile error:",
                createError
            );

            return;

        }



        currentProfile =
            newProfile;


    }
    else{


        currentProfile =
            data;


    }



    applyProfile();


}






// =====================================================
// APPLY PROFILE
// =====================================================


function applyProfile(){



    const email =
        currentUser.email ||
        "member";



    const name =
        currentProfile.display_name ||
        email.split("@")[0];



    if(displayNameInput){

        displayNameInput.value =
            currentProfile.display_name ||
            "";

    }



    if(profileName){

        profileName.textContent =
            name;

    }



    if(
        currentProfile.avatar_url
    ){

        setAvatarImage(
            currentProfile.avatar_url
        );

    }
    else{

        setAvatarLetter(
            name
        );

    }


}






// =====================================================
// AVATAR
// =====================================================


function setAvatarLetter(name){


    if(!avatarPreview){

        return;

    }



    avatarPreview.style.backgroundImage =
        "";


    avatarPreview.textContent =
        (
            name ||
            "M"
        )
        .charAt(0)
        .toUpperCase();



}



function setAvatarImage(url){


    if(!avatarPreview){

        return;

    }



    avatarPreview.textContent =
        "";


    avatarPreview.style.backgroundImage =
        `url("${url}")`;


}






// =====================================================
// EVENTS
// =====================================================


function setupEvents(){



    if(changeAvatarButton){


        changeAvatarButton.addEventListener(
            "click",
            ()=>{

                avatarInput.click();

            }
        );

    }




    if(avatarInput){


        avatarInput.addEventListener(
            "change",
            function(event){


                const file =
                    event.target.files[0];


                if(!file){

                    return;

                }


                selectedAvatarFile =
                    file;



                const url =
                    URL.createObjectURL(
                        file
                    );


                setAvatarImage(
                    url
                );


            }
        );

    }






    if(saveProfileButton){


        saveProfileButton.addEventListener(
            "click",
            saveProfile
        );

    }






    if(logoutButton){


        logoutButton.addEventListener(
            "click",
            logout
        );

    }





    if(backButton){


        backButton.addEventListener(
            "click",
            ()=>{

                window.location.href =
                    "index.html";

            }
        );

    }





    if(homeNav){

        homeNav.onclick =
            ()=>location.href =
            "index.html";

    }



    if(calendarNav){

        calendarNav.onclick =
            ()=>location.href =
            "calendar.html";

    }



    if(timelineNav){

        timelineNav.onclick =
            ()=>location.href =
            "events.html";

    }


}







// =====================================================
// SAVE PROFILE
// =====================================================


async function saveProfile(){



    if(!currentUser){

        return;

    }



    const name =
        displayNameInput.value.trim();



    try{



        let avatarUrl =
            currentProfile.avatar_url;




        if(selectedAvatarFile){


            avatarUrl =
                await uploadAvatar(
                    selectedAvatarFile
                );


        }




        const {
            data,
            error
        } =
        await supabaseClient
            .from("profiles")
            .upsert({

                id:
                    currentUser.id,

                display_name:
                    name,

                avatar_url:
                    avatarUrl,

                updated_at:
                    new Date().toISOString()

            })
            .select()
            .single();




        if(error){

            throw error;

        }



        currentProfile =
            data;



        profileName.textContent =
            name ||
            currentUser.email.split("@")[0];



        showMessage(
            "Profile saved"
        );



    }
    catch(error){


        console.error(
            error
        );


        showMessage(
            error.message
        );


    }


}
// =====================================================
// UPLOAD AVATAR
// =====================================================


async function uploadAvatar(file){


    const filePath =
        `${currentUser.id}/avatar-${Date.now()}.webp`;



    const {
        error
    } =
    await supabaseClient.storage
        .from("avatars")
        .upload(

            filePath,

            file,

            {
                upsert:
                    true,

                contentType:
                    file.type
            }

        );



    if(error){

        throw error;

    }




    const {
        data
    } =
    supabaseClient.storage
        .from("avatars")
        .getPublicUrl(
            filePath
        );



    return data.publicUrl;


}






// =====================================================
// LOGOUT
// =====================================================


async function logout(){


    if(
        !currentUser
    ){

        return;

    }



    try{


        console.log(
            "Setting offline..."
        );



        // Сначала меняем статус

        const {
            error:offlineError
        } =
        await supabaseClient
            .from("profiles")
            .update({

                is_online:
                    false,

                last_seen:
                    new Date().toISOString()

            })
            .eq(
                "id",
                currentUser.id
            );




        if(offlineError){


            console.error(
                "Offline error:",
                offlineError
            );


        }




        // Потом выходим


        const {
            error
        } =
        await supabaseClient.auth.signOut();




        if(error){

            throw error;

        }



        localStorage.removeItem(
            "memoraAuth"
        );



        window.location.href =
            "welcome/welcome.html";



    }
    catch(error){


        console.error(
            "Logout error:",
            error
        );


        showMessage(
            error.message ||
            "Logout error"
        );


    }


}







// =====================================================
// MESSAGE
// =====================================================


function showMessage(text){


    if(!profileMessage){

        return;

    }



    profileMessage.textContent =
        text;



    setTimeout(
        ()=>{

            profileMessage.textContent =
                "";

        },
        3000
    );


}






// =====================================================
// REDIRECT
// =====================================================


function redirectToWelcome(){


    window.location.href =
        "welcome/welcome.html";


}