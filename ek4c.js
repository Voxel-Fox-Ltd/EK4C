console.log("EK4C loaded");


var api;
if (typeof browser !== "undefined") {
    api = browser;
} else {
    api = chrome;
}


async function loadColourScheme() {
    let result = await api.storage.sync.get("colourScheme");
    let scheme = result.colourScheme || "L";
    if(scheme == "D") {
        document.documentElement.classList.add("dark");
    }
}
loadColourScheme();


function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
}
addEventListener("keydown", function(event) {
    if(event.ctrlKey && event.shiftKey && event.key === "D") {
        event.preventDefault();
        toggleDarkMode();
    }
});


if(window.location.hostname == "ych.commishes.com") {
    setupYCHCSS();
    if(window.location.pathname.startsWith("/category/")) {
        console.log("Starting EK4C on ych.commishes.com/category");
        YCHCategory.setup().then(() => {
            YCHCategory.main();
        });
    }
    else if(window.location.pathname.startsWith("/auction/")) {
        console.log("Starting EK4C on ych.commishes.com/auction");
        YCHAuction.setup();
    }
    else if(window.location.pathname.startsWith("/user/")) {
        console.log("Starting EK4C on ych.commishes.com/user");
        YCHUser.setup();
    }
}
else if(window.location.hostname == "ping.commishes.com") {
    setupPingCSS();
}
else if(window.location.hostname == "loot.commishes.com") {
    setupLootCSS();
}
else if(window.location.hostname == "account.commishes.com") {
    setupGeneralTailwindCSS();  // nothing special for the account page
}
else {
    console.log("EK4C: Not on a supported site, doing nothing.");
}
