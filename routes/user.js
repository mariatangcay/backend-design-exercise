const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware'); 


router.post('/register', registerUser);


router.post('/login', loginUser);

// Use authentication middleware for profile retrieval
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
