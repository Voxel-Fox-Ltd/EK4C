var filterMode = "";
var highlightedUsers = []
var filteredUsers = []


const compareArrays = (a, b) => {
    a = a.map(i => i.toLowerCase()).sort();
    b = b.map(i => i.toLowerCase()).sort();
    return JSON.stringify(a) === JSON.stringify(b);
};


const addClassIfNotExists = (element, className) => {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
    }
}

const removeClassIfExists = (element, className) => {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}


class YCHCategory {

    static highlightedCSS = `.ek4c-highlighted > a {border:2px solid #FFD700;box-shadow:0 0 10px #FFD700;}`;

    static async setupHide() {
        document.head.querySelector("#ek4c-style").innerText = `${YCHCategory.highlightedCSS} .ek4c-hidden{display:none;}`;
    }

    static async setupDim() {
        document.head.querySelector("#ek4c-style").innerText = `${YCHCategory.highlightedCSS} .ek4c-hidden{filter:opacity(0.3)}`;
    }

    static async setup() {
        /**
         * Run the setup for ych.commishes.
         * */

        // Add CSS for hidden items
        let style = document.createElement("style");
        style.id = "ek4c-style";
        let existingStyle = document.head.querySelector("#ek4c-style");
        if (!existingStyle) {
            document.head.appendChild(style);
        }
        YCHCategory.setupHide();
    }

    static async loadSettings() {
        /**
         * Load ych.commishes data.
         * */

        // Get filtered users from storage
        let settingsFilteredUsers = await FilteredUsers.getAll();
        let settingsHighlightedUsers = await HighlightedUsers.getAll()
        if(!compareArrays(filteredUsers, settingsFilteredUsers) || !compareArrays(highlightedUsers, settingsHighlightedUsers)) {
            filteredUsers = settingsFilteredUsers;
            filteredUsers = filteredUsers.map(s => s.toLowerCase());
            highlightedUsers = settingsHighlightedUsers;
            highlightedUsers = highlightedUsers.map(s => s.toLowerCase());
            document.querySelectorAll(".ek4c-checked").forEach(i => {
                i.classList.remove("ek4c-checked");
            });
        }

        // Get filter mode from storage
        let settingsMode = await FilterMode.get();
        if(settingsMode == "hide" && filterMode != "hide") {
            await YCHCategory.setupHide();
            filterMode = "hide";
        }
        else if(settingsMode == "dim" && filterMode != "dim") {
            await YCHCategory.setupDim();
            filterMode = "dim";
        }
    }

    static async main() {
        /**
         * The main loop for ych.commishes.
         * */

        // Reload the saved settings
        YCHCategory.loadSettings()

        // Look at everything on the page
        let allListings = document.querySelectorAll("div.component-root[userid]:not(.ek4c-checked)");
        for(let i of allListings) {

            // Get the author
            name = i.querySelector("a div div div span").innerText;

            // Hide filtered ones
            if(filteredUsers.includes(name.toLowerCase())) {
                addClassIfNotExists(i, "ek4c-hidden");
            }
            else {
                removeClassIfExists(i, "ek4c-hidden");
            }

            // Enhance highlighted ones
            if(highlightedUsers.includes(name.toLowerCase())) {
                addClassIfNotExists(i, "ek4c-highlighted");
            }
            else {
                removeClassIfExists(i, "ek4c-highlighted");
            }

            // Store that we've checked this specific listing
            i.classList.add("ek4c-checked")
        }

        // And loop
        setTimeout(YCHCategory.main, 1_000);
    }

}
