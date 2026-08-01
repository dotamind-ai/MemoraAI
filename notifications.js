// =====================================================
// MEMORA GLOBAL NOTIFICATIONS
// Работает только вне chat.html
// Не трогает chat.js
// =====================================================


const GLOBAL_SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";


const GLOBAL_SUPABASE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const globalSupabase =
    window.supabase.createClient(
        GLOBAL_SUPABASE_URL,
        GLOBAL_SUPABASE_KEY
    );



let globalUser = null;
let globalChannel = null;



// =====================================================
// START
// =====================================================


document.addEventListener(
    "DOMContentLoaded",
    startGlobalNotifications
);



async function startGlobalNotifications() {


    // На чате ничего не делаем
    if (
        window.location.pathname.includes(
            "chat.html"
        )
    ) {

        return;

    }



    const {
        data,
        error
    } =
    await globalSupabase
        .auth
        .getSession();



    if (error) {

        console.error(error);

        return;

    }



    if (
        !data.session
    ) {

        return;

    }



    globalUser =
        data.session.user;



    createGlobalToast();


    subscribeGlobalMessages();


}





// =====================================================
// REALTIME
// =====================================================


function subscribeGlobalMessages(){


    if(!globalUser){
        return;
    }



    globalChannel =
        globalSupabase

        .channel(
            "global-message-" +
            globalUser.id
        )


        .on(
            "postgres_changes",

            {

                event:"INSERT",

                schema:"public",

                table:"notifications",

                filter:
                "user_id=eq." +
                globalUser.id

            },


            function(payload){


                const notification =
                    payload.new;



                if(
                    notification.type !==
                    "new_message"
                ){

                    return;

                }



                showGlobalToast(
                    notification
                );


            }

        )


        .subscribe();



}






// =====================================================
// TOAST
// =====================================================


function createGlobalToast(){


    if(
        document.getElementById(
            "globalToastBox"
        )
    ){
        return;
    }



    const box =
        document.createElement(
            "div"
        );


    box.id =
        "globalToastBox";


    document.body.appendChild(
        box
    );



    const style =
        document.createElement(
            "style"
        );



    style.textContent = `


#globalToastBox{

position:fixed;

top:15px;

left:50%;

transform:translateX(-50%);

width:min(420px,calc(100vw - 30px));

z-index:999999;

}


.global-toast{

background:
rgba(20,20,25,.96);

border:

1px solid rgba(255,255,255,.12);

border-radius:18px;

padding:14px;

color:white;

display:flex;

gap:12px;

align-items:center;

box-shadow:
0 20px 60px rgba(0,0,0,.4);

opacity:0;

transform:
translateY(-20px);

transition:.25s;

}



.global-toast.show{

opacity:1;

transform:
translateY(0);

}



.global-avatar{

width:42px;

height:42px;

border-radius:50%;

background:
rgba(139,92,246,.25);

display:flex;

align-items:center;

justify-content:center;

font-weight:800;

}



.global-text{

display:flex;

flex-direction:column;

}



.global-text strong{

font-size:13px;

}



.global-text span{

font-size:11px;

color:
rgba(255,255,255,.5);

}


`;



    document.head.appendChild(
        style
    );

}







function showGlobalToast(
    notification
){



    const box =
        document.getElementById(
            "globalToastBox"
        );



    if(!box){
        return;
    }



    const name =
        getName(
            notification.body
        );



    const message =
        getMessage(
            notification.body
        );



    const toast =
        document.createElement(
            "div"
        );



    toast.className =
        "global-toast";



    toast.innerHTML = `

<div class="global-avatar">

${name[0] || "M"}

</div>


<div class="global-text">

<strong>
${name}
</strong>


<span>
${message}
</span>


</div>


`;



    box.appendChild(
        toast
    );



    setTimeout(()=>{

        toast.classList.add(
            "show"
        );

    },20);




    setTimeout(()=>{

        toast.remove();

    },5000);



}





function getName(body){


    const text =
        String(body || "");



    const index =
        text.indexOf(":");



    if(index===-1){

        return "Memora user";

    }



    return text
    .slice(0,index)
    .trim();


}



function getMessage(body){


    const text =
        String(body || "");



    const index =
        text.indexOf(":");



    if(index===-1){

        return text;

    }



    return text
    .slice(index+1)
    .trim();


}