const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then((user) => {
            done(null, user);
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {

            console.log('profile', profile);

            User.findOne({googleId: profile.id})
                .then((existingUser) => {
                    if (existingUser) {
                        console.log("Already exists " + profile.id);
                        done(null, existingUser);
                    }
                    else {
                        new User({googleId: profile.id})
                            .save()
                            .then(user => {
                                console.log('user instance saved');
                                done(null, user);
                            });
                    }
                });

        }
    )
);



