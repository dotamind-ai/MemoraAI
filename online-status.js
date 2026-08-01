const SUPABASE_URL =
    "https://eabfkvqeveipwpomtjst.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_KXXG6XA21lfQODJkpolUxQ_-QSy6I5W";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


async function updateOnlineStatus() {


    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.log(error);
        return;

    }


    if (
        !data.session
    ) {

        console.log("Нет сессии");
        return;

    }


    const userId =
        data.session.user.id;


    const {
        error: updateError
    } = await supabaseClient
        .from("profiles")
        .update({

            is_online: true,

            last_seen: new Date()

        })
        .eq(
            "id",
            userId
        );


    if (updateError) {

        console.log(
            "Ошибка обновления:",
            updateError
        );

    } else {

        console.log(
            "Пользователь онлайн",
            userId
        );

    }


}


// запуск
updateOnlineStatus();


// обновлять каждые 30 секунд
setInterval(
    updateOnlineStatus,
    30000
);



// при закрытии страницы
window.addEventListener(
    "beforeunload",
    async function(){

        const {
            data
        } =
        await supabaseClient.auth.getSession();


        if (
            !data.session
        ) {

            return;

        }


        await supabaseClient
            .from("profiles")
            .update({

                is_online:false,

                last_seen:new Date()

            })
            .eq(
                "id",
                data.session.user.id
            );

    }
);