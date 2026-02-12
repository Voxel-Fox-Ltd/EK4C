var username = null;
var payload = null;


class YCHAuction {

    static async getAuctionUser() {
        // let userNodes = document.querySelectorAll('#auction a[href^="/user/"]');
        // let username = userNodes[userNodes.length - 1].attributes.href.value.split("/")[2]
        // return username;

        let site = await fetch(document.location.href + ".json");
        let data = await site.json();
        payload = data.payload;
        username = payload.username;
        return username;
    }

    static async setup() {
        /**
         * Run the setup for ych.commishes auctions.
         * */

        // Readd the report link for mobile
        let link = document.querySelector(".report-link");
        if(link === null) return;  // No report link found, probably not logged in
        let parent = link.parentElement;
        if(parent.classList.contains("hidden")) {
            link.parentElement.classList.remove("hidden");
            let newNode = document.createElement("div");
            newNode.classList.add("py-2");
            parent.appendChild(newNode);
        }

        // Add an easy filter button to add the user to the filters
        let filterButtonContainer = document.querySelector("#auction .h-5");
        let filterButton = document.createElement("button");
        filterButton.id = "ek4c-filter-button";
        filterButton.classList.add("ml-2", "px-2", "py-1", "bg-red-500", "text-white", "rounded");
        filterButton.innerText = "Filter user";
        filterButton.addEventListener("click", YCHAuction.filterButtonClicked);
        filterButtonContainer.appendChild(filterButton);
        filterButtonContainer.classList.remove("h-5");
        filterButtonContainer.classList.add("flex", "items-center");
        filterButtonContainer.id = "ek4c-button-container";

        let highlightButton = document.createElement("button");
        highlightButton.id = "ek4c-highlight-button";
        highlightButton.classList.add("ml-2", "px-2", "py-1", "bg-blue-500", "text-white", "rounded");
        highlightButton.innerText = "Highlight user";
        highlightButton.addEventListener("click", YCHAuction.highlightButtonClicked);
        filterButtonContainer.appendChild(highlightButton);

        // Run an API request so we don't need to wait for the page to load fully
        await YCHAuction.getAuctionUser()

        // Set the initial button states
        if(await FilteredUsers.contains(username)) {
            filterButton.innerText = "Unfilter user";
        }
        else {
            filterButton.innerText = "Filter user";
        }
        if(await HighlightedUsers.contains(username)) {
            highlightButton.innerText = "Unhighlight user";
        }
        else {
            highlightButton.innerText = "Highlight user";
        }

        // Add auction start time
        let auctionInfo = document.querySelector("#auction .slots > div:last-of-type");
        let startPriceSpan = document.createElement("span");
        startPriceSpan.innerText = "Starting price: " + auctionInfo.innerText.split(" ")[2];
        let startTime = new Date(payload.endsunix * 1_000);
        let startTimeString = startTime.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        let startTimeSpan = document.createElement("span");
        startTimeSpan.innerText = `Auction ends: ${startTimeString}`;
        auctionInfo.innerText = "";
        auctionInfo.appendChild(startPriceSpan);
        auctionInfo.appendChild(document.createElement("br"));
        auctionInfo.appendChild(startTimeSpan);

        YCHAuction.dialogLoop();
    }

    static dialogLoop() {
        /**
         * Because dialogs are created dynanmically and don't actually have any Tailwind classes,
         * we have to loop forever on these pages to add them dynamically.
         * */

        for(let i of document.querySelectorAll(".dialog-element:not(.ek4c-checked)")) {
            if(i.classList.contains("bg-white")) {
                i.classList.add("dark:bg-gray-800")
                i.classList.add("ek4c-checked")
            }
            for(let i2 of i.querySelectorAll("input")) {
                i2.classList.add("dark:text-gray-800")  // text-black doesn't exist in their minified CSS
            }
            for(let i2 of i.querySelectorAll(".text-gray-800")) {
                i2.classList.add("dark:text-white")
            }
            for(let i2 of i.querySelectorAll(".text-gray-600")) {
                i2.classList.add("dark:text-gray-400")
            }
        }
        setTimeout(YCHAuction.dialogLoop, 100);
    }

    static async filterButtonClicked(event) {
        if(await FilteredUsers.contains(username)) {
            await FilteredUsers.remove(username);
            event.target.innerText = "Filter user";
        }
        else {
            let defaultReason = "Quick added from auction page";
            let reason = prompt("Why are you filtering this user?", defaultReason);
            if(reason === null) return;
            await FilteredUsers.add(username, reason || defaultReason);
            event.target.innerText = "Unfilter user";
        }
    }

    static async highlightButtonClicked(event) {
        if(await HighlightedUsers.contains(username)) {
            await HighlightedUsers.remove(username);
            event.target.innerText = "Highlight user";
        }
        else {
            let defaultReason = "Quick added from auction page";
            let reason = prompt("Why are you highlighting this user?", defaultReason);
            if(reason === null) return;
            await HighlightedUsers.add(username, reason || defaultReason);
            event.target.innerText = "Unhighlight user";
        }
    }

}
