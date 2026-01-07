var username = null;


class YCHAuction {

    static async getAuctionUser() {
        // let userNodes = document.querySelectorAll('#auction a[href^="/user/"]');
        // let username = userNodes[userNodes.length - 1].attributes.href.value.split("/")[2]
        // return username;

        let site = await fetch(document.location.href + ".json");
        let data = await site.json();
        username = data.payload.username;
        return username;
    }

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
        filterButton.id = "ek4c-filter-button";
        filterButton.classList.add("ml-2", "px-2", "py-1", "bg-red-500", "text-white", "rounded");
        filterButton.innerText = "Filter user";
        filterButton.addEventListener("click", YCHAuction.filterButtonClicked);
        filterButtonContainer.appendChild(filterButton);
        filterButtonContainer.classList.remove("h-5");
        filterButtonContainer.classList.add("flex", "items-center");
        filterButtonContainer.id = "ek4c-filter-button";

        // Run an API request so we don't need to wait for the page to load fully
        await YCHAuction.getAuctionUser()
        if(await FilteredUsers.contains(username)) {
            filterButton.innerText = "Unfilter user";
        }
        else {
            filterButton.innerText = "Filter user";
        }
    }

    static async filterButtonClicked(event) {
        // let username = YCHAuction.getAuctionUser();
        if(await FilteredUsers.contains(username)) {
            await FilteredUsers.remove(username);
            event.target.innerText = "Filter user";
        }
        else {
            await FilteredUsers.add(username, "Quick added from auction page");
            event.target.innerText = "Unfilter user";
        }
    }

}
