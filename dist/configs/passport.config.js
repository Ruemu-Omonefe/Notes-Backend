"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_github_1 = require("passport-github");
const user_model_1 = __importDefault(require("../models/user.model"));
const axios_1 = __importDefault(require("axios"));
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await user_model_1.default.findOne({ email, provider: 'local' });
        if (!user || !user.password)
            return done(null, false, { message: 'User not found' });
        const isMatch = await user.comparePassword(password);
        return isMatch ? done(null, user) : done(null, false, { message: 'Invalid credentials' });
    }
    catch (err) {
        return done(err);
    }
}));
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        // Check if user with this email already exists with a different provider
        const existingEmailUser = await user_model_1.default.findOne({ email });
        if (existingEmailUser && existingEmailUser.provider !== 'google') {
            return done(new Error(`User already exists with this email using a different provider(${existingEmailUser.provider}).`));
        }
        const user = await user_model_1.default.findOneAndUpdate({ provider: 'google', providerId: profile.id }, { username: profile.displayName, email: email }, { upsert: true, new: true, setDefaultsOnInsert: true });
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
// Facebook Strategy
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name', 'displayName'],
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const user = await user_model_1.default.findOneAndUpdate({ provider: 'facebook', providerId: profile.id }, { username: profile.displayName, email: profile.emails?.[0].value }, { upsert: true, new: true, setDefaultsOnInsert: true });
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
// GitHub Strategy
passport_1.default.use(new passport_github_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`
}, async (_accessToken, _refreshToken, profile, cb) => {
    try {
        let email = profile.emails?.[0]?.value;
        // If email is not available in profile, fetch it using accessToken
        if (!email) {
            const { data: emails } = await axios_1.default.get("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `token ${_accessToken}`,
                    Accept: "application/vnd.github+json",
                },
            });
            // Find the primary verified email
            const primaryEmail = emails.find((e) => e.primary && e.verified);
            email = primaryEmail?.email || emails[0]?.email;
        }
        // Check if user with this email already exists with a different provider
        const existingEmailUser = await user_model_1.default.findOne({ email });
        if (existingEmailUser && existingEmailUser.provider !== 'github') {
            return cb(new Error(`User already exists with this email using a different provider(${existingEmailUser.provider}).`));
        }
        // console.log("GitHub profile:", profile);
        const user = await user_model_1.default.findOneAndUpdate({ provider: 'github', providerId: profile.id }, { username: profile.username || profile.displayName || "GitHubUser", email: email }, { upsert: true, new: true, setDefaultsOnInsert: true });
        cb(null, user);
    }
    catch (err) {
        cb(err);
    }
}));
// Serialize and Deserialize User
passport_1.default.serializeUser((user, done) => done(null, user.id));
passport_1.default.deserializeUser(async (id, done) => {
    const user = await user_model_1.default.findById(id);
    done(null, user);
});
