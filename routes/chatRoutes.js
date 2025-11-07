const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat/send
router.post('/send', chatController.sendMessage);

// GET /api/chat/messages
router.get('/messages', chatController.getMessages);

module.exports = router;
