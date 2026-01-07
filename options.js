async function saveOptions(e) {
    e.preventDefault();
    await browser.storage.sync.set({
        highlightedUsers: document.querySelector("#highlighted-users").value.trim().split("\n").map(s => s.trim()).filter(s => s.length > 0),
        filteredUsers: document.querySelector("#filtered-users").value.trim().split("\n").map(s => s.trim()).filter(s => s.length > 0),
        filterMode: document.querySelector("#filter-mode").value
    });
}

async function restoreOptions() {
    let highlightedUsers = await browser.storage.sync.get("highlightedUsers");
    document.querySelector("#highlighted-users").value = (highlightedUsers.highlightedUsers || []).join("\n");
    let filteredUsers = await browser.storage.sync.get("filteredUsers");
    document.querySelector("#filtered-users").value = (filteredUsers.filteredUsers || []).join("\n");
    let filterMode = await browser.storage.sync.get("filterMode");
    document.querySelector("#filter-mode").value = filterMode.filterMode || "hide";
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
