const express = require("express");
const authControllers = require("../controllers/authControllers")
const userControllers = require("../controllers/userControllers")
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
})


const router = express.Router();

router.post('/register', upload.single('profile_pic'), authControllers.registerUser)
router.post('/login', authControllers.loginUser)
router.post('/logout', authControllers.logoutUser)
router.get('/user-details', userControllers.userDetails)
router.post('/update-user', upload.single('profile_pic'), userControllers.updateUserDetails)
router.post('/search-user', userControllers.searchUser)

module.exports = router