class FilteredUsers {

    static async getAll() {
        /**
         * Get all filtered users from storage.
         * */
        let res = await browser.storage.sync.get("filteredUsers");
        return (res.filteredUsers || [])
    }

    static async add(username) {
        /**
         * Add a user to the filtered users list.
         * */
        let users = await FilteredUsers.getAll();
        if(!users.includes(username)) {
            users.push(username);
            await browser.storage.sync.set({filteredUsers: users});
        }
        return users;
    }

    static async remove(username) {
        /**
         * Remove a user from the filtered users list.
         * */
        let users = await FilteredUsers.getAll();
        users = users.filter(u => u.toLowerCase() !== username.toLowerCase());
        await browser.storage.sync.set({filteredUsers: users});
        return users;
    }

    static async contains(username) {
        /**
         * Check if a user is in the filtered users list.
         * */
        let users = await FilteredUsers.getAll();
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
