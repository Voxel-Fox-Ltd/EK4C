class YCHAuction {

    static async setup() {
        /**
         * Run the setup for ych.commishes auctions.
         * */

        // Readd the report link for mobile
        let link = document.querySelector(".report-link");
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
        filterButton.classList.add("ml-2", "px-2", "py-1", "bg-red-500", "text-white", "rounded");
        filterButton.innerText = "[Un]filter user";
        filterButton.addEventListener("click", YCHAuction.filterButtonClicked);
        filterButtonContainer.appendChild(filterButton);
        filterButtonContainer.classList.remove("h-5");
        filterButtonContainer.classList.add("flex", "items-center");
        filterButtonContainer.id = "ek4c-filter-button";

        // Just wait a second for the username to load
        setTimeout(async () => {
            let username = document.querySelector('#auction a[href^="/user/"]').attributes.href.value.split("/")[2]
            if(await FilteredUsers.contains(username)) {
                filterButton.innerText = "Unfilter user";
            }
            else {
                filterButton.innerText = "Filter user";
            }
        }, 1_000);
    }

    static async filterButtonClicked(event) {
        let username = document.querySelector('#auction a[href^="/user/"').attributes.href.value.split("/")[2]
        if(await FilteredUsers.contains(username)) {
            await FilteredUsers.remove(username);
            event.target.innerText = "Filter user";
        }
        else {
            await FilteredUsers.add(username);
            event.target.innerText = "Unfilter user";
        }
    }

}
