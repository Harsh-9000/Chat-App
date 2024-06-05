const cloudinary = require('cloudinary');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const User = require("../models/User")
const { uploadImage } = require('../helpers/cloudinary')

async function userDetails(req, res) {
    try {
        const token = req.cookies.token || ""
        const user = await getUserDetailsFromToken(token);

        return res.status(200).json({
            message: "User Details",
            data: user
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

async function updateUserDetails(req, res) {
    try {
        const token = req.cookies.token || "";
        const user = await getUserDetailsFromToken(token);
        const { name } = req.body;
        const profilePic = req.file;

        let updatedImageUrl = null;

        if (profilePic) {
            const oldUserDetails = await User.findById(user._id);
            const oldProfilePicUrl = oldUserDetails.profile_pic;

            if (oldProfilePicUrl) {
                const publicId = oldProfilePicUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            updatedImageUrl = await uploadImage(profilePic);
        }

        await User.updateOne(
            { _id: user._id },
            { name, ...(updatedImageUrl && { profile_pic: updatedImageUrl }) }
        );

        return res.json({
            message: "Updated User Details",
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        });
    }
}

async function searchUser(req, res) {
    try {
        const { search } = req.body;
        const token = req.cookies.token || "";
        const currentUser = await getUserDetailsFromToken(token);

        if (!currentUser) {
            return res.status(401).json({
                message: "Unauthorized",
                error: true
            });
        }

        const query = new RegExp(search, "i");

        const users = await User.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        }).select("-password");

        // Filter out the current user from the results
        const filteredUsers = users.filter(user => user._id.toString() !== currentUser._id.toString());

        return res.json({
            message: "User Found",
            data: filteredUsers,
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        });
    }
}

module.exports = { userDetails, updateUserDetails, searchUser }