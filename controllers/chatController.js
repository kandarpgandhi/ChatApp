const { ChatMessage, User } = require('../models');

const sendMessage = async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: 'User ID and message are required' });
        }

        const chatMessage = await ChatMessage.create({ userId, message });

        res.status(201).json({
            message: 'Message stored successfully',
            chat: chatMessage
        });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.findAll({
            include: [{ model: User, attributes: ['id', 'name', 'email'] }],
            order: [['createdAt', 'ASC']],
        });

        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { sendMessage, getMessages };
