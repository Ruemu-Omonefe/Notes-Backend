"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.oauthSuccess = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_util_1 = require("../utils/jwt.util");
const passport_1 = __importDefault(require("passport"));
// User registration controller
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user exists
        const existingUser = await user_model_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Create new user
        const user = new user_model_1.default({ username, email, password, provider: 'local' });
        await user.save();
        // Generate token
        const token = (0, jwt_util_1.generateToken)(user);
        res.status(201).json({ token: token, user: { id: user._id, username, email } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
// User login controller
const login = async (req, res, next) => {
    passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user)
            return res.status(400).json({ message: info?.message || 'Login failed' });
        const token = (0, jwt_util_1.generateToken)(user);
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        res.json({ user: userData, token });
    })(req, res, next);
};
exports.login = login;
const oauthSuccess = async (req, res) => {
    if (!req.user)
        return res.redirect('/login');
    const user = req.user;
    const token = (0, jwt_util_1.generateToken)(user._id);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
};
exports.oauthSuccess = oauthSuccess;
const getMe = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.user.id).select('-password');
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMe = getMe;
