var api;
if (typeof browser !== "undefined") {
    api = browser;
} else {
    api = chrome;
}


document.getElementById("openOptions").addEventListener("click", async () => {
    // Works in Firefox and Chrome
    await api.runtime.openOptionsPage();
    window.close();
});
