const socket = require('socket.io')
const { Message, Chat } = require('../models/chat')
const initializeSocket = (server) => {
    const io = socket(server,{
        cors: {
          origin: ['http://localhost:5173', 'https://devtindercricketapp.netlify.app'],
          credentials: true,
        }
      })
      
      io.on('connection', (socket) => {
        console.log('a user connected')

        // JOIN CHAT
        socket.on('joinChat', async ({ userId, chatUserId }) => {
            // Sort the user ids to ensure consistent room naming - Same room for same users
            const room = [userId, chatUserId].sort().join("-");
            socket.join(room)
            console.log(`joined room ${room}`)

            // FETCH EXISTING MESSAGES FOR THIS CHAT
            try {
                const chat = await Chat.findOne({users: {$all: [userId, chatUserId]}})
                    .populate({
                        path: 'messages',
                        populate: {
                            path: 'senderId',
                            select: 'firstName lastName'
                        }
                    });
                
                if (chat) {
                    socket.emit('loadMessages', chat.messages);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        })

        // SEND MESSAGE
        socket.on('sendMessage', async ({roomId, message, userId, chatUserId}) => {
            // SAVE MESSAGE TO DATABASE
            try {
                // CREATE NEW MESSAGE
                const newMessage = new Message({
                    senderId: userId,
                    content: message,
                });
                await newMessage.save();

                // FIND OR CREATE CHAT
                let chat = await Chat.findOne({users: {$all: [userId, chatUserId]}})
                if(!chat) {
                    chat = new Chat({
                        users: [userId, chatUserId],
                        messages: []
                    });
                }

                console.log('newMessage', newMessage)
                
                // ADD MESSAGE TO CHAT
                chat.messages.push(newMessage._id);
                await chat.save();

                // EMIT THE MESSAGE WITH POPULATED SENDER INFO
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('senderId', 'firstName lastName');
                
                io.to(roomId).emit('receiveMessage', {
                    firstName: populatedMessage.senderId.firstName,
                    message: populatedMessage.content,
                    userId: populatedMessage.senderId._id,
                    chatUserId,
                    timestamp: populatedMessage.createdAt
                });
            } catch (error) {
                console.error('Error saving message to database', error)
            }
        })

        socket.on('disconnect', () => {
            console.log('a user disconnected')
        })
      })
}

module.exports = initializeSocket
