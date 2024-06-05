const Message = require('../models/Message');
const { uploadImage } = require('../helpers/cloudinary')
const { uploadVideo } = require('../helpers/cloudinary')

async function uploadImageFiles(req, res) {
    try {
        const url = await uploadImage(req.file);
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: 'Image upload failed' });
    }
};

async function uploadVideoFiles(req, res) {
    try {
        const url = await uploadVideo(req.file);
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: 'Video upload failed' });
    }
};

async function saveMessage(req, res) {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
};

module.exports = { uploadImageFiles, uploadVideoFiles, saveMessage };