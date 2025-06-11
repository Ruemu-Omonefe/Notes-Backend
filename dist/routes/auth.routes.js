"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), auth_controller_1.oauthSuccess);
// router.get('/google/callback', (req, res, next) => {
//   passport.authenticate('google', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       console.error("Google Auth Failed:", err || info);
//       return res.status(401).json({ message: 'Google login failed', error: err.message || info.message });
//     }
//     return oauthSuccess(req, res);
//   })(req, res, next);
// });
router.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { session: false }), auth_controller_1.oauthSuccess);
router.get('/github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport_1.default.authenticate('github', { session: false }), auth_controller_1.oauthSuccess);
// router.get('/github/callback', (req, res, next) => {
//   passport.authenticate('github', { session: false }, (err: any, user: any, info: any) => {
//     if (err || !user) {
//       console.error("Github Auth Failed:", err || info);
//       return res.status(401).json({ message: 'Github login failed', error: err.message || info.message });
//     }
//     return oauthSuccess(req, res);
//   })(req, res, next);
// });
router.get('/me', auth_controller_1.getMe);
exports.default = router;
