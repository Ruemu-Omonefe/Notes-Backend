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
        res.json({ user, token });
    })(req, res, next);
    // try {
    //   const { email, password } = req.body;
    //   // Check if user exists
    //   const user = await User.findOne({ email });
    //   if (!user) {
    //     return res.status(400).json({ message: 'Invalid credentials' });
    //   }
    //   // Check password
    //   const isMatch = await user.comparePassword(password);
    //   if (!isMatch) {
    //     return res.status(400).json({ message: 'Invalid credentials' });
    //   }
    //   // Generate token
    //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    //     expiresIn: process.env.JWT_EXPIRE
    //   });
    //   res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
    // } catch (error) {
    //   res.status(500).json({ message: 'Server error' });
    // }
};
exports.login = login;
// export const oauthSuccess = async (req: Request, res: Response) => {
//   if (!req.user) return res.redirect('/login');
//   const user = req.user as any;
//   res.json({ token: generateToken(user._id) });
// };
// export const oauthError = (req: Request, res: Response) => {
//   res.status(400).json({ message: 'OAuth authentication failed' });   
// }
const oauthSuccess = async (req, res) => {
    if (!req.user)
        return res.redirect('/login');
    const user = req.user;
    res.json({
        token: (0, jwt_util_1.generateToken)(user._id),
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
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
