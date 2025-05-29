import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github';
import User from '../models/user.model';

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const user = await User.findOneAndUpdate(
      { provider: 'google', providerId: profile.id },
      { username: profile.displayName, email: profile.emails?.[0].value },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

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

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
  }, async(_accessToken, _refreshToken, profile, cb) => {
    try {
      console.log("GitHub profile:", profile);
      const user = await User.findOneAndUpdate(
        { provider: 'github', providerId: profile.id },
        { username: profile.username || profile.displayName || "GitHubUser", email: profile.emails?.[0].value },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  }
));

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
