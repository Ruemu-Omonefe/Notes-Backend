import { Router } from 'express';
import passport from 'passport';
import { register, login, oauthSuccess , getMe} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), oauthSuccess);
// router.get('/google/callback', (req, res, next) => {
//   passport.authenticate('google', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       console.error("Google Auth Failed:", err || info);
//       return res.status(401).json({ message: 'Google login failed', error: err.message || info.message });
//     }
//     return oauthSuccess(req, res);
//   })(req, res, next);
// });



router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), oauthSuccess);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), oauthSuccess);
// router.get('/github/callback', (req, res, next) => {
//   passport.authenticate('github', { session: false }, (err: any, user: any, info: any) => {
//     if (err || !user) {
//       console.error("Github Auth Failed:", err || info);
//       return res.status(401).json({ message: 'Github login failed', error: err.message || info.message });
//     }
//     return oauthSuccess(req, res);
//   })(req, res, next);
// });



router.get('/me',protect, getMe);

export default router;