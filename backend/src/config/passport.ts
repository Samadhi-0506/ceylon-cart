import dotenv from 'dotenv';
import path from 'path';

// Load .env FIRST before anything else
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User';

const GOOGLE_ID     = process.env.GOOGLE_CLIENT_ID     || '';
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FB_ID         = process.env.FACEBOOK_APP_ID      || '';
const FB_SECRET     = process.env.FACEBOOK_APP_SECRET  || '';

console.log('🔑 Google Client ID loaded:', GOOGLE_ID ? '✅ YES' : '❌ EMPTY - check .env file');
console.log('🔑 Facebook App ID loaded: ', FB_ID     ? '✅ YES' : '❌ EMPTY - check .env file');

if (!GOOGLE_ID || !GOOGLE_SECRET) {
  console.error('❌ ERROR: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing in .env');
  console.error('   File location should be: D:\\ceylon-cart\\backend\\.env');
} else {
  passport.use(new GoogleStrategy(
    {
      clientID:     GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL:  'http://localhost:5000/api/auth/google/callback',
      scope:        ['profile', 'email']
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email returned from Google'), undefined);
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name:     profile.displayName || email.split('@')[0],
            email,
            password: `google_${profile.id}_${Date.now()}`,
            role:     'user',
            avatar:   profile.photos?.[0]?.value || ''
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  ));
  console.log('✅ Google OAuth strategy registered');
}

if (!FB_ID || !FB_SECRET) {
  console.error('❌ ERROR: FACEBOOK_APP_ID or FACEBOOK_APP_SECRET is missing in .env');
  console.error('   File location should be: D:\\ceylon-cart\\backend\\.env');
} else {
  passport.use(new FacebookStrategy(
    {
      clientID:      FB_ID,
      clientSecret:  FB_SECRET,
      callbackURL:   'http://localhost:5000/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos']
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `fb_${profile.id}@ceyloncart.lk`;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name:     profile.displayName ||
                      `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() ||
                      'Facebook User',
            email,
            password: `facebook_${profile.id}_${Date.now()}`,
            role:     'user',
            avatar:   profile.photos?.[0]?.value || ''
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  ));
  console.log('✅ Facebook OAuth strategy registered');
}

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