// Load required packages
var passport = require('passport');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
options.secretOrKey = process.env.UNIQUE_KEY;


passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        var user = db.find(jwt_payload.id);

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
}));

exports.isAuthenticated = passport.authenticate('JWT', { session : false });
exports.secret = options.secretOrKey ;