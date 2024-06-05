const cloudinary = require('cloudinary').v2;

async function uploadImage(imageFile) {
    const b64 = Buffer.from(imageFile.buffer).toString('base64');
    const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
}

async function uploadVideo(videoFile) {
    const b64 = Buffer.from(videoFile.buffer).toString('base64');
    const dataURI = `data:${videoFile.mimetype};base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI, { resource_type: 'video' });
    return res.url;
}

module.exports = { uploadImage, uploadVideo };