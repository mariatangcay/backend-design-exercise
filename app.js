require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user');
const { limiter, requestLogger } = require('./middleware/authMiddleware'); // Import middleware without authenticateToken

const app = express();
const PORT = process.env.PORT || 3000;

const tokenSecret = process.env.TOKEN_SECRET;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Apply the request logger
app.use(requestLogger);

// Apply rate limiter to all requests
app.use(limiter);

// Use user routes
app.use('/api/users', userRoutes); // The routes already handle authentication where needed

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
