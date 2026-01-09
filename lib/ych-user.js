class YCHUser {

    static async setup() {
        /**
         * Run the setup for ych.commishes user pages.
         * */

        let username = document.querySelector("#profile span.hidden").innerText;

        // Add a loot button to the reputation number
        let linktree = document.querySelector(".linktree").children[0];
        let communitySection = linktree.children[2];
        let reputationSection = communitySection.children[1].children[0].querySelector(".text-3xl")
        let reputationValue = reputationSection.innerText;
        let reputationLink = document.createElement("a");
        reputationLink.classList = reputationSection.classList;
        reputationLink.dataset.value = reputationSection.dataset.value;
        reputationLink.href = "//loot.commishes.com/user/profile/" + encodeURIComponent(username);
        reputationLink.innerText = reputationValue;
        reputationLink.target = "_blank";
        reputationSection.outerHTML = reputationLink.outerHTML;
        console.log("Added loot link to reputation section.");

        // Add an easy filter button
        let filterButtonSibling = document.querySelector("#commission-button");
        let filterButton = document.createElement("button");
        filterButton.id = "ek4c-filter-button";
        filterButton.classList.add("mr-4", "py-2", "px-4", "bg-red-500", "text-white", "rounded-md", "text-md", "mr-4");
        filterButton.innerText = "Filter user";
        filterButton.addEventListener("click", YCHUser.filterButtonClicked);
        filterButtonSibling.insertAdjacentElement("afterend", filterButton);
        console.log("Added filter button to user page.");

        // Add an easy highlight button
        let highlightButton = document.createElement("button");
        highlightButton.id = "ek4c-highlight-button";
        highlightButton.classList.add("mr-4", "py-2", "px-4", "bg-blue-500", "text-white", "rounded-md", "text-md", "mr-4");
        highlightButton.innerText = "Highlight user";
        highlightButton.addEventListener("click", YCHUser.highlightButtonClicked);
        filterButton.insertAdjacentElement("afterend", highlightButton);
        console.log("Added highlight button to user page.");

        // Get username from hidden field on page
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
    }

    static async filterButtonClicked(event) {
        let username = document.querySelector("#profile span.hidden").innerText;
        if(await FilteredUsers.contains(username)) {
            await FilteredUsers.remove(username);
            event.target.innerText = "Filter user";
        }
        else {
            let defaultReason = "Quick added from user page";
            let reason = prompt("Why are you filtering this user?", defaultReason);
            if(reason === null) return;
            await FilteredUsers.add(username, reason || defaultReason);
            event.target.innerText = "Unfilter user";
        }
    }

    static async highlightButtonClicked(event) {
        let username = document.querySelector("#profile span.hidden").innerText;
        if(await HighlightedUsers.contains(username)) {
            await HighlightedUsers.remove(username);
            event.target.innerText = "Highlight user";
        }
        else {
            let defaultReason = "Quick added from user page";
            let reason = prompt("Why are you highlighting this user?", defaultReason);
            if(reason === null) return;
            await HighlightedUsers.add(username, reason || defaultReason);
            event.target.innerText = "Unhighlight user";
        }
    }

}
