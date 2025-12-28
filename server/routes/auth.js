import express from 'express';
const router = express.Router();
import {
    register,
    login,
    logout,
    checkSession,
    getMe
} from '../controllers/authController.js';
import {
    validateRegistration,
    validateLogin,
    handleValidationErrors
} from '../utils/validators.js';
import { isAuthenticated } from '../middleware/auth.js';

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', validateRegistration, handleValidationErrors, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', logout);

// @route   GET /api/auth/check-session
// @desc    Check if user is authenticated
// @access  Public
router.get('/check-session', checkSession);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', isAuthenticated, getMe);

export default router;