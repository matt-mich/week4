// Load required packages
var passport = require('passport');
var ExtractJwt = require('passport-jwt').ExtractJwt;

var options = {};
var JwtStrategy = require('passport-jwt').Strategy;

options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
//options.secretOrKey = process.env.UNIQUE_KEY;

options.secretOrKey = "TEST KEY";


passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        var user = db.find(jwt_payload.id);

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
}));

exports.isAuthenticated = passport.authenticate('jwt', { session : false });
exports.secret = opts.secretOrKey ;