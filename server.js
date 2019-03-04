// Base code from https://github.com/shawnmccarthy/week4

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authJwtController = require('./auth_jwt');
db = require('./db')(); //global hack
var jwt = require('jsonwebtoken');

var hardcoded_user = "matt";
var hardcoded_pass = "1234";


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

// Signup
router.route('/signup')
    .post( function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({success: false, msg: 'Please pass username and password.'});
        } else {
            if(db.findOne(req.body.username)){
                res.json({success: false, msg: 'User already exists.'});
            }else{
                var newUser = {
                    username: req.body.username,
                    password: req.body.password
                };
                db.save(newUser); //no duplicate checking
                res.json({success: true, msg: 'Successful created new user.'});

            }
        }
    })
    
    .get(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for signup.'});
    })

    .put(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for signup.'});
    })

    .delete(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for signup.'});
    })

    .patch(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for signup.'});
    });



// Sign-in
router.route('/signin')

    .post(function(req, res) {
        var user = db.findOne(req.body.username);

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        }else {
            // check if password matches
            if (req.body.password === user.password)  {
                var userToken = { id : user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.UNIQUE_KEY);
                res.json({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
        }
    })
    .get(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for sign in.'});
    })

    .put(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for sign in.'});
    })

    .delete(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for sign in.'});
    })

    .patch(function(req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for sign in.'});
    });



// Movies
router.route('/movies')
    .post(function (req, res) {
        q = "None";
        h = req.headers;

        if(req.body.query){
            q = req.body.query;
        }
        res.status(200).send({ status:200,msg: 'POST movies',headers:h,query:q,env:process.env.UNIQUE_KEY});
    })

    .get(function (req, res) {
         q = "None";
         h = req.headers;

         if(req.body.query){
             q = req.body.query;
         }
         res.status(200).send({ status:200,msg: 'GET movies',headers:h,query:q,env:process.env.UNIQUE_KEY});
    })

    .put(authJwtController.isAuthenticated, function (req, res) {
        q = "None";
        h = req.headers;

        if(req.body.query){
            q = req.body.query;
        }
        res.status(200).send({ status:200,msg: 'PUT movies',headers:h,query:q,env:process.env.UNIQUE_KEY});
    })

    .delete(function (req, res) {
        if(req.body.username === hardcoded_user && req.body.password === hardcoded_pass){
            q = "None";
            h = req.headers;
            if(req.body.query){
                q = req.body.query;
            }
            res.status(200).send({ status:200,msg: 'DELETE movies',headers:h,query:q,env:process.env.UNIQUE_KEY});
        }else{
            res.status(401).send({ status:401,msg: 'Unauthorized'});
        }


    })

    .patch(function (req, res) {
        res.status(501).send({success: false, msg: 'Unsupported access type for movies.'});
    });


app.use('/', router);
app.listen(process.env.PORT || 8080);