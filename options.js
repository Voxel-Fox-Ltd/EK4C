var api;
if (typeof browser !== "undefined") {
    api = browser;
} else {
    api = chrome;
}


async function exportSettings() {
    let settings = await saveOptions();
    let json = JSON.stringify(settings, null, 2);
    let blob = new Blob([json], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `ek4c-settings.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


async function importSettings(file) {
    let text = await file.text();
    let settings = JSON.parse(text);
    console.log(settings);
    await saveOptions(settings);
    await restoreOptions();
}


async function saveOptions(settings=null) {
    if(settings === null) {
        settings = {
            colourScheme: document.querySelector("#colour-scheme").value,
            safeMode: document.querySelector("#safe-mode").value,
            highlightedUsers: document.querySelector("#highlighted-users").value.trim().split("\n").map(s => s.trim()).filter(s => s.length > 0),
            filteredUsers: document.querySelector("#filtered-users").value.trim().split("\n").map(s => s.trim()).filter(s => s.length > 0),
            filterMode: document.querySelector("#filter-mode").value
        }
    }
    console.log("Saving settings", settings)
    await api.storage.sync.set(settings);
    return settings;
}

async function restoreOptions() {
    let colourScheme = await api.storage.sync.get("colourScheme");
    document.querySelector("#colour-scheme").value = colourScheme.colourScheme || "L";
    let safeMode = await api.storage.sync.get("safeMode");
    document.querySelector("#safe-mode").value = safeMode.safeMode || "3";
    let highlightedUsers = await api.storage.sync.get("highlightedUsers");
    document.querySelector("#highlighted-users").value = (highlightedUsers.highlightedUsers || []).join("\n");
    let filteredUsers = await api.storage.sync.get("filteredUsers");
    document.querySelector("#filtered-users").value = (filteredUsers.filteredUsers || []).join("\n");
    let filterMode = await api.storage.sync.get("filterMode");
    document.querySelector("#filter-mode").value = filterMode.filterMode || "hide";
}

restoreOptions();

document.getElementById("colour-scheme").addEventListener("input", () => {saveOptions(null)})
document.getElementById("safe-mode").addEventListener("input", () => {saveOptions(null)})
document.getElementById("highlighted-users").addEventListener("input", () => {saveOptions(null)})
document.getElementById("filtered-users").addEventListener("input", () => {saveOptions(null)})
document.getElementById("filter-mode").addEventListener("input", () => {saveOptions(null)})

let importFile = document.getElementById("import-file");

document.getElementById("export-button").addEventListener("click", exportSettings);
document.getElementById("import-button").addEventListener("click", () => {
    importFile.value = "";  // allow re-importing the same file
    importFile.click();
});
importFile.addEventListener("change", () => {
    const file = importFile.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
        setStatus("Import failed: file is too large.");
        return;
    }
    importSettings(file);
});
