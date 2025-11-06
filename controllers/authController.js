const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Sequelize } = require('../models');
const Op = Sequelize.Op;

const SECRET = process.env.JWT_SECRET || 'changeme';

const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await User.findOne({
            where: { [Op.or]: [{ email }, { phone }] }
        });

        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, phone, password: hashed });

        return res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password)
            return res.status(400).json({ message: 'Email/Phone and password required' });

        const user = await User.findOne({
            where: { [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }] }
        });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { login, signup }