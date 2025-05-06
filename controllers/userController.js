const { getUsers, saveUsers } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); // Import Joi

// Validation schemas
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

// Register a new user
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    
    // Validate input
    const { error } = registerSchema.validate({ username, password, email });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const users = getUsers();

    // Check if the username is already taken
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword, email };

    users.push(newUser);
    saveUsers(users);
    res.status(201).json({ message: 'User registered successfully' });
};

// Log in an existing user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    const { error } = loginSchema.validate({ username, password });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN_SECRET || 'secret_key', { expiresIn: '1h' }); // JWT with expiration
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
};

// Retrieve user profile
const getUserProfile = async (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);
    res.json(user);
};

module.exports = { registerUser, loginUser, getUserProfile };
