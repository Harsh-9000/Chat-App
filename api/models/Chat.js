const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message'
        }
    ]
}, { timestamps: true })

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;