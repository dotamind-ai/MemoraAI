// =====================================================
// MEMORA GLOBAL MESSAGE NOTIFICATIONS
// =====================================================

const MEMORA_SUPABASE_URL =
"https://eabfkvqeveipwpomtjst.supabase.co";


const MEMORA_SUPABASE_KEY =
"sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const memoraSupabase =
window.supabase.createClient(
    MEMORA_SUPABASE_URL,
    MEMORA_SUPABASE_KEY
);


// =====================================================
// STATE
// =====================================================

let notificationUser = null;
let notificationChannel = null;
let toastContainer = null;


// =====================================================
// START
// =====================================================

document.addEventListener(
"DOMContentLoaded",
startNotifications
);


async function startNotifications(){


    // чат пока не трогаем
    if(
        window.location.pathname.includes("chat.html")
    ){
        return;
    }


    const {
        data,
        error
    } =
    await memoraSupabase
    .auth
    .getSession();


    if(error){
        console.error(error);
        return;
    }


    if(
        !data.session
    ){
        return;
    }


    notificationUser =
    data.session.user;


    createToastContainer();

    addToastStyles();

    subscribeNotifications();

}



// =====================================================
// REALTIME
// =====================================================

function subscribeNotifications(){


    notificationChannel =
    memoraSupabase
    .channel(
        "memora-global-message"
    )
    .on(
        "postgres_changes",
        {

            event:"INSERT",

            schema:"public",

            table:"notifications",

            filter:
            "user_id=eq."+
            notificationUser.id

        },


        payload=>{


            const notification =
            payload.new;


            if(
                notification.type ===
                "new_message"
            ){

                showToast(
                    notification
                );

            }


        }

    )
    .subscribe();

}



// =====================================================
// TOAST
// =====================================================

function createToastContainer(){


    toastContainer =
    document.createElement(
        "div"
    );


    toastContainer.id =
    "memora-toast";


    document.body.appendChild(
        toastContainer
    );

}



function showToast(notification){


    const toast =
    document.createElement(
        "div"
    );


    toast.className =
    "memora-toast";


    const text =
    notification.body ||
    "New message";


    toast.innerHTML = `

        <div class="toast-avatar">
            M
        </div>

        <div class="toast-text">
            <b>New message</b>
            <span>${text}</span>
        </div>

        <div class="toast-close">
            ×
        </div>

    `;


    toastContainer.appendChild(
        toast
    );


    setTimeout(()=>{

        toast.classList.add(
            "show"
        );

    },10);



    setTimeout(()=>{

        toast.remove();

    },5000);



}



// =====================================================
// CSS
// =====================================================

function addToastStyles(){


const style =
document.createElement(
"style"
);


style.textContent = `


#memora-toast{

position:fixed;

top:15px;

left:50%;

transform:translateX(-50%);

width:min(420px,90vw);

z-index:999999;

}


.memora-toast{


display:flex;

align-items:center;

gap:12px;

padding:12px;

border-radius:18px;

background:
rgba(20,20,25,.96);

border:
1px solid rgba(255,255,255,.12);

color:white;

box-shadow:
0 20px 60px rgba(0,0,0,.4);

opacity:0;

transform:
translateY(-20px);


transition:.3s;


}


.memora-toast.show{


opacity:1;

transform:
translateY(0);


}



.toast-avatar{


width:45px;

height:45px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

background:#8b5cf6;

font-weight:800;


}



.toast-text{


display:flex;

flex-direction:column;

overflow:hidden;


}


.toast-text span{


font-size:12px;

color:#aaa;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;


}



.toast-close{

margin-left:auto;

font-size:22px;

color:#777;


}



`;

document.head.appendChild(style);


}