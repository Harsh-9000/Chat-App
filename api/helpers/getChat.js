const Chat = require("../models/Chat")

const getChat = async (currentUserId) => {
    if (currentUserId) {
        const currentUserChats = await Chat.find({
            "$or": [
                { sender: currentUserId },
                { recipient: currentUserId }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('recipient')

        const chats = currentUserChats.map((chat) => {
            const countUnseenMessages = chat.messages.reduce((prev, curr) => {
                if (curr?.senderId.toString() !== currentUserId) {
                    return prev + (curr?.seen ? 0 : 1)
                } else {
                    return prev
                }
            }, 0)

            return {
                _id: chat?._id,
                sender: chat?.sender,
                recipient: chat?.recipient,
                unseenMessages: countUnseenMessages,
                lastMessage: chat.messages[chat?.messages?.length - 1]
            }
        })

        return chats
    } else {
        return []
    }
}

module.exports = getChat