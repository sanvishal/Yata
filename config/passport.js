const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");

const keys = require("./keys");

const config = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.serverSecret,
};

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(config, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => {
          throw console.log(
            "[AUTH] Something happened during passport JWT checking ---->\n",
            err
          );
        });
    })
  );
};
