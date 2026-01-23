const IGNORED_TAGS = [
    "STYLE",
    "SCRIPT",
    "LINK",
    "META",
    "NOSCRIPT",
    // "SVG",
    "PATH",
    "HEAD",
    "TITLE",
];


function getClassList(element) {
    if(element.tagName.toUpperCase() === "SVG") {
        return element.className.baseVal.split(" ")
    }
    return element.className.split(" ");
}


function setClassList(element, classList) {
    if(element.tagName.toUpperCase() === "SVG") {
        element.className.baseVal = classList.join(" ");
    }
    else {
        element.className = classList.join(" ");
    }
}


function addNewClassToElement(element, newClassName, ignoreAlreadySet=0, ignoreQuery="dark:") {
    // Ignore some tags that we'll never need to worry about
    if(element.tagName && IGNORED_TAGS.includes(element.tagName.toUpperCase())) {
        return;
    }
    let classes = getClassList(element)

    // Skip elements that already have a dark: class
    // We shouldn't be here due to the query modification, but it doesn't appear to be
    // consistent for whatever reason
    if(ignoreAlreadySet == 1) {
        let hasIgnoreClass = false;
        for(let c of classes) {
            if(c.startsWith(ignoreQuery)) {
                hasIgnoreClass = true;
                break;
            }
        }
        if(hasIgnoreClass) {
            return;
        }
    }

    // Remove existing dark: classes
    if(ignoreAlreadySet == 2) {
        classes = classes.filter(c => !c.startsWith("dark:"));
    }

    // Add new classes
    for(let cls of newClassName.split(" ")) {
        classes.push(cls);
    }
    setClassList(element, classes);
}


function removeClass(query, className) {
    let elements = document.querySelectorAll(query);
    let filteredClasses = className.split(" ");
    for(let element of elements) {
        let classes = getClassList(element)
        classes = classes.filter(c => !filteredClasses.includes(c));
        setClassList(element, classes);
    };
}


function addNewClass(query, newClassName, ignoreAlreadySet=0, ignoreQuery="dark:") {
    /**
     * Adds a new class to all elements matching the query.
     * If ignoreAlreadySet is 1, it will skip elements that already have a dark: class.
     * If ignoreAlreadySet is 2, it will replace existing dark: classes with the new class.
     */
    if(ignoreAlreadySet == 1) {
        query = `${query}:not([class^="${ignoreQuery}"]), ${query}:not([class*=" ${ignoreQuery}"])`
    }
    let elements = document.querySelectorAll(query);
    for(let element of elements) {
        try {
            addNewClassToElement(element, newClassName, ignoreAlreadySet, ignoreQuery);
        }
        catch(e) {
            console.error("EK4C: Error adding class to element", element, e);
        }
    };
}


function injectStyle(id, cssText) {
    let style = document.getElementById(id);
    if (!style) {
        style = document.createElement("style");
        style.id = id;
        document.head.appendChild(style);
    }
    style.textContent = cssText;
}

function removeColorFromClassCSS(selector) {
    let allSelectors = Array.isArray(selector) ? selector : [selector];
    let joinedSelectors = allSelectors.join(", ");
    injectStyle(
        "ek4c-remove-colors-override",
        `
        ${joinedSelectors} {
          color: unset !important;
          background: unset !important;
          background-color: unset !important;
        }
        `
    );
}


async function setupGeneralTailwindCSS() {
    matches = {
        "white": "black",

        "gray-50": "gray-950",
        "gray-100": "gray-900",
        "gray-200": "gray-800",
        "gray-300": "gray-700",
        "gray-400": "gray-600",
        "gray-600": "gray-400",
        "gray-700": "gray-300",
        "gray-800": "gray-200",
        "gray-900": "gray-100",
        "gray-950": "gray-50",

        "slate-50": "slate-950",
        "slate-100": "slate-900",
        "slate-200": "slate-800",
        "slate-300": "slate-700",
        "slate-400": "slate-600",
        "slate-600": "slate-400",
        "slate-700": "slate-300",
        "slate-800": "slate-200",
        "slate-900": "slate-100",
        "slate-950": "slate-50",
    };

    for (const [lightClass, darkClass] of Object.entries(matches)) {
        addNewClass(`.bg-${lightClass}`, `dark:bg-${darkClass}`, 1);
        addNewClass(`.text-${lightClass}`, `dark:text-${darkClass}`, 1, "dark:text-");
        addNewClass(`.border-${lightClass}`, `dark:border-${darkClass}`, 1, "dark:border-");
        addNewClass(`.border-b-${lightClass}`, `dark:border-b-${darkClass}`, 1, "dark:border-b-");
        addNewClass(`.border-t-${lightClass}`, `dark:border-t-${darkClass}`, 1, "dark:border-t-");
    }
    addNewClass("button.bg-sky-500", "dark:text-white", 2)
    addNewClass("button.bg-green-500", "dark:text-white", 2)
    addNewClass("textarea", "dark:bg-gray-900 dark:text-white");
}


async function setupYCHCSS() {
    await setupGeneralTailwindCSS();
    removeColorFromClassCSS([
        ".styled-select",
        ".settings-badges .setting-badge .title",
        ".settings-badges .setting-badge .additional",
    ]);
    injectStyle(
        "ek4c-dark-active-tab",
        "html.dark .tab.active {border-bottom: 3px solid white;}",
    );

    addNewClass(".tabs .tab", "dark:text-white");
    addNewClass(".setting-badge", "dark:border-gray-800 dark:bg-slate-600 dark:text-white")
    addNewClass(".report-link", "text-black, dark:text-white");
    addNewClass(".styled-select option", "text-black dark:text-white dark:bg-gray-800");
    addNewClass("footer", "dark:bg-black dark:text-gray-400 border-none border-t-gray-300 dark:border-t-gray-800", 2);

    // watchlist, auctions, and bid history have their own cases
    let path = window.location.pathname;
    let singlePagePages = [
        "/bids/history",
        "/watchlist",
        "/account",
        "/block",
        "/settings/display",
        "/bids/manage",
    ];
    // if path starts with anything from singlePagePages
    if(singlePagePages.some(p => path.startsWith(p))) {
        function bidPageWaitLoop() {
            if(document.querySelector("spinner-material") !== null) {
                setTimeout(bidPageWaitLoop, 100);
                return;
            }
            document.querySelector("#main > div > .px-4").classList.remove("dark:bg-slate-600");  // Remove bg from bids & watchlist
            document.querySelector("#main > div > .px-4 > div:nth-of-type(2) > div").id = "stack-holder";
            document.querySelectorAll("#stack-holder > div:not([class])").forEach(el => {
                el.classList.add("stack-item");
                if(el.querySelector("div.h-3") !== null) {
                    el.querySelector("div.h-3").remove();
                }
                el.classList.add("mb-3");
                el.classList.add("dark:bg-slate-800");
                if(el.querySelector("div.container") !== null) {
                    el.querySelector("div.container").classList.add("dark:hover:bg-gray-950");
                }
            });
            setTimeout(bidPageWaitLoop, 100);
        }
        bidPageWaitLoop();
    }

    // auction create also gets its own case
    if(path == "/auction/create" || path == "/auction/create/") {
        document.querySelector("div#main > main").id = "main2";
        removeClass("#main2", "bg-slate-100 dark:bg-slate-500")
        addNewClass("#main2", "dark-slate-900");
        addNewClass("#main2 #category", "dark:border-gray-800");
    }
    else if(path.startsWith("/auction/start/") || path.startsWith("/sale/start/")) {
        // frankly the auction radio buttons looks like shit so I'm just redoing it
        // unfortunately due to some event handling on this page i have to redo it really awkwardly

        // this is my goal:
        // <div class="container bg-white dark:bg-slate-700 text-white p-4 rounded border border-gray-200 dark:border-gray-700 gap-3 dark:text-white text-black">
        //     <p>How long should your auction be running?</p>
        //     <ul class="container mt-4">
        //         <li><label><input type="radio" name="duration" value="24" required=""> 24 hours (<span class="price-tag" data-duration="24">Free</span>)</label></li>
        //         <li><label><input type="radio" name="duration" value="3d" required=""> 3 days (<span class="price-tag" data-duration="3d">Free</span>)</label></li>
        //         <li><label><input type="radio" name="duration" value="7d" required=""> 7 days (<span class="price-tag" data-duration="7d">Free</span>)</label></li>
        //     </ul>
        //     <div class="mt-4">
        //         <button class="button">Go</button>
        //     </div>
        // </div>
        let m = document.querySelector(".material");
        m.className = "container bg-white dark:bg-slate-700 text-white p-4 rounded border border-gray-200 dark:border-gray-700 gap-3 text-gray-900 dark:text-gray-100";
        let u = document.createElement("ul");
        u.className = "container mt-2";
        m.querySelectorAll("label").forEach((label) => {
            let li = document.createElement("li");
            li.appendChild(label);
            u.appendChild(li);
        });
        let f = m.querySelector(".form-footer");
        m.insertBefore(u, f);
        f.className = "form-footer mt-4";
    }
    else if(path.startsWith("/auction/ready/") || path.startsWith("/sale/ready/")) {
        addNewClass(".prose", "dark:text-gray-400");
        addNewClass(".prose a", "dark:text-gray-400");
        document.querySelector(".prose strong").style.color = "inherit";  // I can't override the weird query it has in the TW file
        let m = document.querySelector(".material");
        m.className = "span2 bg-white dark:bg-slate-700 text-black p-4 rounded border border-gray-200 dark:border-gray-700 dark:text-gray-100";
        addNewClass(".field label", "text-gray-600-i dark:text-gray-400-i");
        addNewClass(".field input", "text-black dark:text-black")
        m.querySelector("input[type=submit]").style.fontFamily = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji";
    }
}


async function setupPingCSS() {
    await setupGeneralTailwindCSS();

    addNewClass("body", "bg-slate-50 dark:bg-slate-900");
    addNewClass("nav span", "dark:text-white");
    addNewClass("nav a", "dark:text-white");
    addNewClass(".add-ping", "dark:bg-gray-800");
    addNewClass(".very", "dark:text-white");

    addNewClass(".user-name", "dark:text-white");
    addNewClass(".bio", "dark:text-white");
    addNewClass(".follower-count", "dark:text-white");
    addNewClass(".follow-count", "dark:text-white");
    addNewClass(".liked-count", "dark:text-white");
    addNewClass(".ping-count", "dark:text-white");
}


async function setupLootCSS() {
    await setupGeneralTailwindCSS();

    let body = document.querySelector("body");
    body.style.margin = 0;
    body.style.padding = "8px";
    addNewClass("body", "bg-slate-50 dark:bg-slate-900");
    addNewClass(".navbar .desktop-only:first-of-type", "dark:text-white");
    injectStyle("ek4c-material-box-shadow", ".material {box-shadow: none;}");
    addNewClass("body .auto-extend > .row", "dark:bg-slate-800")
    addNewClass("body .auto-extend .row .material", "dark:bg-slate-800")
    // addNewClass(".material .span.l3 .text:gray-500", "dark:text-gray-300");
    // addNewClass(".material .l3 .text\\:gray-600", "dark:text-gray-200");
    addNewClass("body h2", "dark:text-white");
}