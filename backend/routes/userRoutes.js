const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/userController');

// Ruta login
router.post('/login', loginUser);

// Ruta registro
router.post('/register', registerUser);

module.exports = router;
