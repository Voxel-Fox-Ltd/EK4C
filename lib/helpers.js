class FilteredUsers {

    static async getAll() {
        /**
         * Get all filtered users from storage.
         * */

        let res = await browser.storage.sync.get("filteredUsers");
        let users = (res.filteredUsers || [])
        return users.map(u => u.split(" ")[0]);  // Remove reasons
    }

    static async add(username, reason=null) {
        /**
         * Add a user to the filtered users list.
         * */

        let users = await FilteredUsers.getAll();
        if(users.includes(username)) return;

        let res = await browser.storage.sync.get("filteredUsers");
        let newUsers = (res.filteredUsers || [])
        newUsers.push(reason ? `${username} ${reason}` : username);
        await browser.storage.sync.set({filteredUsers: newUsers});
    }

    static async remove(username) {
        /**
         * Remove a user from the filtered users list.
         * */

        let res = await browser.storage.sync.get("filteredUsers");
        let users = (res.filteredUsers || []);
        users = users.filter(u => u.split(" ")[0].toLowerCase() !== username.toLowerCase());
        await browser.storage.sync.set({filteredUsers: users});
    }

    static async contains(username) {
        /**
         * Check if a user is in the filtered users list.
         * */

        let users = await FilteredUsers.getAll();
        return users.map(u => u.toLowerCase()).includes(username.toLowerCase());
    }
}


class HighlightedUsers {

    static async getAll() {
        /**
         * Get all filtered users from storage.
         * */

        let res = await browser.storage.sync.get("highlightedUsers");
        let users = (res.highlightedUsers || [])
        return users.map(u => u.split(" ")[0]);  // Remove reasons
    }

    static async add(username, reason=null) {
        /**
         * Add a user to the filtered users list.
         * */

        let users = await HighlightedUsers.getAll();
        if(users.includes(username)) return;

        let res = await browser.storage.sync.get("highlightedUsers");
        let newUsers = (res.highlightedUsers || [])
        users.push(reason ? `${username} ${reason}` : username);
        await browser.storage.sync.set({highlightedUsers: users});
    }

    static async remove(username) {
        /**
         * Remove a user from the filtered users list.
         * */

        let res = await browser.storage.sync.get("highlightedUsers");
        let users = (res.highlightedUsers || []);
        users = users.filter(u => u.split(" ")[0].toLowerCase() !== username.toLowerCase());
        await browser.storage.sync.set({highlightedUsers: users});
    }

    static async contains(username) {
        /**
         * Check if a user is in the filtered users list.
         * */

        let users = await HighlightedUsers.getAll();
        return users.map(u => u.toLowerCase()).includes(username.toLowerCase());
    }
}


class FilterMode {

    static async get() {
        /**
         * Get the filter mode from storage.
         * */

        let res = await browser.storage.sync.get("filterMode");
        return (res.filterMode || "hide")
    }

    static async set(mode) {
        /**
         * Set the filter mode.
         * */

        await browser.storage.sync.set({filterMode: mode});
    }
}


class SafetyFilter {

    static async get() {
        /**
         * Get the filter mode from storage.
         * */

        let res = await browser.storage.sync.get("safeMode");
        return parseInt(res.safeMode || 3);
    }

    static async set(mode) {
        /**
         * Set the filter mode.
         * */

        await browser.storage.sync.set({safeMode: mode});
    }
}
