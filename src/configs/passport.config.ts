import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github';
import User from '../models/user.model';
import axios from "axios";

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email, provider: 'local' });
    if (!user || !user.password) return done(null, false, { message: 'User not found' });
    const isMatch = await user.comparePassword(password);
    return isMatch ? done(null, user) : done(null, false, { message: 'Invalid credentials' });
  } catch (err) {
    return done(err);
  }
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0].value;
    // Check if user with this email already exists with a different provider
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser && existingEmailUser.provider !== 'google') {
      return done(new Error(`User already exists with this email using a different provider(${existingEmailUser.provider}).`));
    }
    const user = await User.findOneAndUpdate(
      { provider: 'google', providerId: profile.id },
      { username: profile.displayName, email: email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID!,
  clientSecret: process.env.FB_CLIENT_SECRET!,
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'displayName'],
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const user = await User.findOneAndUpdate(
      { provider: 'facebook', providerId: profile.id },
      { username: profile.displayName, email: profile.emails?.[0].value },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
  }, async(_accessToken, _refreshToken, profile, cb) => {
    try {
        let email = profile.emails?.[0]?.value;
        // If email is not available in profile, fetch it using accessToken
        if (!email) {
          const { data: emails } = await axios.get("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${_accessToken}`,
              Accept: "application/vnd.github+json",
            },
          });

          // Find the primary verified email
          const primaryEmail = emails.find((e: any) => e.primary && e.verified);
          email = primaryEmail?.email || emails[0]?.email;
        }

                // Check if user with this email already exists with a different provider
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser && existingEmailUser.provider !== 'github') {
          return cb(new Error(`User already exists with this email using a different provider(${existingEmailUser.provider}).`));
        }

        
      // console.log("GitHub profile:", profile);
      const user = await User.findOneAndUpdate(
          { provider: 'github', providerId: profile.id },
          { username: profile.username || profile.displayName || "GitHubUser", email: email },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  }
));


// Serialize and Deserialize User
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
