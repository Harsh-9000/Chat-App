const User = require("../models/User")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const profilePic = req.file;

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
                message: "Email already exists",
                error: true
            });
        }

        const bcryptSalt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, bcryptSalt);

        let updatedImageUrl = null;
        if (profilePic) {
            updatedImageUrl = await uploadImage(profilePic);
        }

        const createdUser = await User.create({
            name,
            email,
            password: hashedPassword,
            profile_pic: updatedImageUrl
        });

        return res.status(201).json({
            message: "User created successfully",
            data: {
                id: createdUser._id,
                email: createdUser.email,
                name: createdUser.name,
            },
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(400).json({
                message: "User does not exist",
                error: true,
            });
        }

        const passOk = await bcryptjs.compare(password, foundUser.password);

        if (!passOk) {
            return res.status(400).json({
                message: "Wrong email or password",
                error: true,
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        jwt.sign(
            { userId: foundUser._id, email, name: foundUser.name },
            jwtSecret,
            (err, token) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error signing token",
                        error: true,
                    });
                }

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 86400000,
                })

                res.status(200).json({
                    message: "Login Successful",
                    data: {
                        id: foundUser._id,
                        email: foundUser.email,
                        name: foundUser.name,
                    },
                    success: true,
                    token: token
                });
            }
        );
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
        });
    }
}

async function logoutUser(req, res) {
    try {
        res.cookie('token', '', { sameSite: 'none', secure: true }).status(200).json({
            message: "Session Over",
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
        });
    }
}

async function uploadImage(imageFile) {
    const b64 = Buffer.from(imageFile.buffer).toString('base64');
    const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
}

module.exports = { registerUser, loginUser, logoutUser };