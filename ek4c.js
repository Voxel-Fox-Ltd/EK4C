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
    if(window.location.pathname == "/") {
        YCHCategory.setupTabs();
    }
    else if(window.location.pathname.startsWith("/category/")) {
        console.log("Starting EK4C on ych.commishes.com/category");
        YCHCategory.setup().then(() => {
            YCHCategory.main();
        });
    }
    else if(window.location.pathname.startsWith("/auction/")) {
        console.log("Starting EK4C on ych.commishes.com/auction");
        YCHCategory.setupTabs()
        YCHAuction.setup();
    }
    else if(window.location.pathname.startsWith("/user/")) {
        console.log("Starting EK4C on ych.commishes.com/user");
        YCHUser.setup();
    }
    else if(window.location.pathname.startsWith("/report/")) {
        console.log("Starting EK4C on ych.commishes.com/report");
        for(let m of document.querySelectorAll(".material")) {
            // When you make a report, the site adds a "material" div which has an inbuilt colour.
            // As far as I can tell, this is the only time that this happens on the entire website.
            // Remove the material class and add some Tailwind classes to make it look better in
            // dark mode, and reasonable in light mode.
            m.className = "border rounded border-gray-200 p-4 dark:border-gray-800";
        }
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
