// =====================================================
// MEMORA PRESENCE
// Online / Last Seen
// =====================================================

const PRESENCE_INTERVAL = 30000;

let presenceTimer = null;

async function startPresence() {

    if (!window.memoraSupabase || !window.currentUser) {
        return;
    }

    await setOnline();

    presenceTimer = setInterval(async () => {
        await updateLastSeen();
    }, PRESENCE_INTERVAL);

}

async function setOnline() {

    try {

        await window.memoraSupabase
            .from("profiles")
            .update({
                is_online: true,
                last_seen: new Date().toISOString()
            })
            .eq("id", window.currentUser.id);

    } catch (e) {
        console.error("Presence online error", e);
    }

}

async function updateLastSeen() {

    try {

        await window.memoraSupabase
            .from("profiles")
            .update({
                last_seen: new Date().toISOString()
            })
            .eq("id", window.currentUser.id);

    } catch (e) {
        console.error("Presence update error", e);
    }

}

async function setOffline() {

    try {

        await window.memoraSupabase
            .from("profiles")
            .update({
                is_online: false,
                last_seen: new Date().toISOString()
            })
            .eq("id", window.currentUser.id);

    } catch (e) {
        console.error("Presence offline error", e);
    }

}

window.addEventListener("beforeunload", () => {
    setOffline();
});

document.addEventListener("visibilitychange", () => {

    if (document.visibilityState === "hidden") {

        setOffline();

    } else {

        setOnline();

    }

});