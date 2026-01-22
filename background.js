var api;
if (typeof browser !== "undefined") {
    api = browser;
} else {
    api = chrome;
}


api.runtime.onInstalled.addListener(async (details) => {
    // Run only on first install, not on updates
    if (details.reason !== "install") {
        return;
    }
    await api.runtime.openOptionsPage();
});
