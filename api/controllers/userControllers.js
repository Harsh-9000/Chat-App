const cloudinary = require('cloudinary');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const User = require("../models/User")

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

async function uploadImage(imageFile) {
    const b64 = Buffer.from(imageFile.buffer).toString('base64');
    const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
}

module.exports = { userDetails, updateUserDetails }