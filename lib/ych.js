function addNewClass(query, className, ignoreAlreadySet=0) {
    /**
     * Adds a new class to all elements matching the query.
     * If ignoreAlreadySet is 1, it will skip elements that already have a dark: class.
     * If ignoreAlreadySet is 2, it will replace existing dark: classes with the new class.
     */
    if(ignoreAlreadySet == 1) {
        query = `${query}:not([class^="dark:"]), ${query}:not([class*=" dark:"])`
    }
    let elements = document.querySelectorAll(query);
    elements.forEach(element => {
        if(ignoreAlreadySet == 2) {
            // Remove existing dark: classes
            let classes = element.className.split(" ");
            classes = classes.filter(c => !c.startsWith("dark:"));
            element.className = classes.join(" ");
        }
        for(let cls of className.split(" ")) {
            element.classList.add(cls);
        }
    });
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
    // Add some generalised dark modes to EVERYTHING that already uses Tailwind's CSS
    addNewClass(".bg-slate-50", "dark:bg-slate-900", 1);
    addNewClass(".bg-white", "dark:bg-gray-800", 1);
    // addNewClass(".bg-white", "dark:bg-slate-800", 1);
    // addNewClass(".bg-white", "dark:bg-slate-700", 1);
    addNewClass(".bg-white", "dark:bg-slate-700", 1);
    addNewClass(".bg-gray-50", "dark:bg-slate-600", 1);
    addNewClass(".bg-gray-100", "dark:bg-slate-600", 1);
    addNewClass(".hover\\:bg-gray-100:hover", "hover:dark:bg-slate-800", 1);

    addNewClass(".text-black", "dark:text-white", 1);
    addNewClass(".text-gray-900", "dark:text-gray-100", 1);
    // addNewClass(".text-gray-900", "dark:text-gray-200", 1);
    addNewClass(".text-gray-800", "dark:text-white", 1);
    addNewClass(".text-gray-700", "dark:text-gray-300", 1);
    addNewClass(".text-slate-600", "dark:text-gray-300", 1);
    addNewClass(".text-gray-600", "dark:text-gray-400", 1);
    addNewClass(".text-gray-500", "dark:text-gray-400", 1);
    // addNewClass(".text-sm", "dark:text-gray-400", 1);

    addNewClass(".border-gray-100", "dark:border-gray-900", 1);
    // addNewClass(".border-gray-100", "dark:border-gray-500", 1);
    addNewClass(".border-gray-200", "dark:border-gray-800", 1);
    addNewClass(".border-gray-300", "dark:border-gray-800", 1);
    addNewClass(".border-b-gray-200", "dark:border-b-gray-700", 1);
    addNewClass(".border-b-gray-300", "dark:border-b-gray-700", 1);
    addNewClass(".border-t-gray-300", "dark:border-t-gray-800", 1);

    addNewClass("textarea", "dark:text-gray-800");
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
}


async function setupPingCSS() {
    await setupGeneralTailwindCSS();

    addNewClass("body", "dark:bg-slate-700");
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