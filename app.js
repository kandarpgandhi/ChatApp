const express = require('express')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const PORT = 3000
const SECRET = 'MYSCECRETKEY'

app.use(bodyParser.json())
app.use(cors())

const DATABASE_FILE = './database.json'

function readUsers() {
    if (!fs.existsSync(DATABASE_FILE)) return [];
    const data = fs.readFileSync(DATABASE_FILE);
    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(users, null, 2));
}

app.post('/signup', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const users = readUsers();
    const existing = users.find(u => u.email === email || u.phone === phone);
    if (existing) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, phone, password: hashedPassword };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "User registered successfully" });
});

app.post('/login', async (req, res) => {
    const { emailOrPhone, password } = req.body;

    const users = readUsers();
    const user = users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token });
});

app.get('/', (req, res) => {
    res.send('API is working! Use /signup or /login endpoints.');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));