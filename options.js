async function saveOptions() {
    await browser.storage.sync.set({
        safeMode: document.querySelector("#safe-mode").value,
        highlightedUsers: document.querySelector("#highlighted-users").value.trim().split("\n").map(s => s.trim()).filter(s => s.length > 0),
        filteredUsers: document.querySelector("#filtered-users").value.trim().split("\n").map(s => s.trim()).filter(s => s.length > 0),
        filterMode: document.querySelector("#filter-mode").value
    });
}

async function restoreOptions() {
    let safeMode = await browser.storage.sync.get("safeMode");
    document.querySelector("#safe-mode").value = safeMode.safeMode || "3";
    let highlightedUsers = await browser.storage.sync.get("highlightedUsers");
    document.querySelector("#highlighted-users").value = (highlightedUsers.highlightedUsers || []).join("\n");
    let filteredUsers = await browser.storage.sync.get("filteredUsers");
    document.querySelector("#filtered-users").value = (filteredUsers.filteredUsers || []).join("\n");
    let filterMode = await browser.storage.sync.get("filterMode");
    document.querySelector("#filter-mode").value = filterMode.filterMode || "hide";
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("safe-mode").addEventListener("input", saveOptions)
document.getElementById("highlighted-users").addEventListener("input", saveOptions)
document.getElementById("filtered-users").addEventListener("input", saveOptions)
document.getElementById("filter-mode").addEventListener("input", saveOptions)
