const db = require("../models");
const User = db.user;

const UserService = {

    async create(data) {
        console.log("data:", data)
        try {
            await User.create(data);
        } catch(err) {
            console.error("Error: ", err);
            throw new Error("Failed to create a user");
        }
    }

}