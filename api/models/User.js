const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"]
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"]
    },
    profile_pic: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;