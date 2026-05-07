const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const User = require("../models/user.model");


passport.serializeUser((user , done) => {
  done(null , user.id);
});

passport.deserializeUser(async (id , done) => {
  const user = await User.findById(id);
  done(null , user);
});

/*
GOOGLE STRATEGY
*/
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
      },

      async (accessToken, refreshToken, profile, done) => {
        try {

          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("No email found") , null);
          }
          // Find existing user
          let user = await User.findOne({ email });

          // Create new user if not exists
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value || "",
              provider: "google"
            });
          }

          return done(null, user);

        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}



/*
GITHUB STRATEGY
*/

if (process.env.GITHUB_CLIENT_ID) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
      },

      async (accessToken, refreshToken, profile, done) => {

        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

        let user = await User.findOne({ email });

        if (!user) {

          user = await User.create({
            name: profile.username,
            email,
            provider: "github"
          });

        }

        done(null, user);

      }
    )
  );
}



/*
LINKEDIN STRATEGY
*/

if (process.env.LINKEDIN_CLIENT_ID) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL,
        scope: ["r_emailaddress", "r_liteprofile"]
      },

      async (accessToken, refreshToken, profile, done) => {

        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {

          user = await User.create({
            name: profile.displayName,
            email,
            provider: "linkedin"
          });

        }

        done(null, user);

      }
    )
  );
}



module.exports = passport;