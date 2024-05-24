const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    text: String,
    file: String,
}, { timestamps: true });

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;