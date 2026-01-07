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
    }

}
