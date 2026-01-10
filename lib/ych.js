function addNewClass(query, className) {
    let elements = document.querySelectorAll(query);
    elements.forEach(element => {
        element.classList.add(className);
    });
}


async function setupYCHCSS() {
    addNewClass(".tabs .tab", "dark:text-white");
    addNewClass(".home .py-12", "dark:text-white");
    addNewClass(".home .py-12 a", "dark:text-white");
    addNewClass("footer", "dark:bg-gray-800");
    addNewClass("footer", "dark:border-gray-800");
    // addNewClass(".setting-badge .title", "dark:text-gray-300");
    // addNewClass(".setting-badge .additional", "dark:text-white");
    addNewClass(".row3 p", "dark:text-gray-300");
}


async function setupPingCSS() {
    addNewClass("body", "dark:bg-slate-700");
    addNewClass("nav span", "dark:text-white");
    addNewClass("nav a", "dark:text-white");
    addNewClass(".add-ping", "dark:bg-gray-800");
    addNewClass(".very", "dark:text-white");
}