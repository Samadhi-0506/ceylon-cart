import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('No email from Google'), undefined);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName || email.split('@')[0],
        email,
        password: `google_oauth_${profile.id}_${Date.now()}`,
        role: 'user',
        avatar: profile.photos?.[0]?.value || ''
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err as Error, undefined);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || '',
  clientSecret: process.env.FACEBOOK_APP_SECRET || '',
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'displayName', 'photos']
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `fb_${profile.id}@ceyloncart.lk`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`.trim() || 'Facebook User',
        email,
        password: `facebook_oauth_${profile.id}_${Date.now()}`,
        role: 'user',
        avatar: profile.photos?.[0]?.value || ''
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err as Error, undefined);
  }
}));

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { _id: string })._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;