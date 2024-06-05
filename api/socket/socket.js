const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const dotenv = require('dotenv');
const User = require("../models/User")
const Chat = require("../models/Chat")
const Message = require('../models/Message')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const getChat = require('../helpers/getChat')

const app = express();
dotenv.config();

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: process.env.CLIENT_URL,
    }
})

const onlineUser = new Set();

io.on('connection', async (socket) => {
    console.log("User Connected", socket.id);

    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (user?._id) {
        socket.join(user._id.toString());
        onlineUser.add(user._id.toString());

        io.emit('onlineUser', Array.from(onlineUser));
    }

    socket.on('message-page', async (userId) => {
        const userDetails = await User.findById(userId).select("-password")

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }

        socket.emit('message-user', payload)

        const getChat = await Chat.findOne({
            "$or": [
                { sender: user._id, recipient: userId },
                { sender: userId, recipient: user._id }
            ]
        }).populate('messages').sort({ updatedAt: -1 })

        socket.emit('message', getChat?.messages || [])
    })


    socket.on('new-message', async (data) => {
        let chat = await Chat.findOne({
            "$or": [
                { sender: data?.sender, recipient: data?.recipient },
                { sender: data?.recipient, recipient: data?.sender }
            ]
        })

        if (!chat) {
            const createChat = await Chat({
                sender: data?.sender,
                recipient: data?.recipient
            })

            chat = await createChat.save()
        }

        const message = new Message({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            senderId: data?.sender
        })

        const savedMessage = await message.save();

        await Chat.updateOne({ _id: chat?._id }, {
            "$push": { messages: savedMessage?._id }
        })

        const getChatMessages = await Chat.findOne({
            "$or": [
                { sender: data?.sender, recipient: data?.recipient },
                { sender: data?.recipient, recipient: data?.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 })

        io.to(data?.sender).emit('message', getChatMessages?.messages || [])
        io.to(data?.recipient).emit('message', getChatMessages?.messages || [])

        const chatSender = await getChat(data?.sender)
        const chatRecipient = await getChat(data?.recipient)

        io.to(data?.sender).emit('chat', chatSender)
        io.to(data?.recipient).emit('chat', chatRecipient)
    })

    socket.on('logout', () => {
        if (user?._id) {
            onlineUser.delete(user._id.toString());
            io.emit('onlineUser', Array.from(onlineUser));
            socket.leave(user._id.toString());
        }
    });

    socket.on('sidebar', async (currentUserId) => {
        const chats = await getChat(currentUserId)

        socket.emit('chat', chats)
    })

    socket.on('seen', async (senderId) => {
        let chat = await Chat.findOne({
            "$or": [
                { sender: user?._id, recipient: senderId },
                { sender: senderId, recipient: user?._id }
            ]
        })

        const chatMessageId = chat.messages || [];

        await Message.updateMany(
            { _id: { "$in": chatMessageId }, senderId: senderId },
            { "$set": { seen: true } }
        )

        const chatSender = await getChat(user?._id?.toString())
        const chatRecipient = await getChat(senderId)

        io.to(user?._id?.toString()).emit('chat', chatSender)
        io.to(senderId).emit('chat', chatRecipient)
    })

    socket.on('disconnect', () => {
        if (user?._id) {
            onlineUser.delete(user._id.toString());
            io.emit('onlineUser', Array.from(onlineUser));
            socket.leave(user._id.toString());
        }
        console.log("User Disconnected", socket.id);
    });
});


module.exports = {
    app,
    server
}