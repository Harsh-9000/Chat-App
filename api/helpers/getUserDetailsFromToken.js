const jwt = require("jsonwebtoken");
const User = require("../models/User")

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "Session Over",
            logout: true
        }
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET)

    const user = User.findById(decode.userId).select("-password")

    return user;
}

module.exports = getUserDetailsFromToken