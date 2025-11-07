require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
// 🟩 View Routes
app.get('/', (req, res) => res.redirect('/signup'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

// Chat page view
app.get('/chat', (req, res) => {
    res.render('chat');
});

// Start server
(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected and synced');
        app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err);
    }
})();
