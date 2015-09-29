var express = require('express');
var router = express.Router();
var passport = require('passport');
var restrict = require('../auth/restrict');
var config = require('../config');
var UserService = require('../services/user-service');
var PostService = require("../services/post-service");

/* GET home page. */
router.get('/', restrict, function(req, res, next) {
    res.redirect('/app.html');
});
/* GET signup page. */
router.get('/signup', function(req, res, next) {
    res.render('signup', {
        username: "",
        errors: ""
    });
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {
    if (req.body.password.length > 7) {
        UserService.addUser(req.body, function(err) {
            if (err) {
                console.log(err);
                res.render('signup', {
                    username: "",
                    errors: err
                });
            }
            else {
                res.redirect('/');
            }
        });
    }
    else {

        res.render('signup', {
            username: req.body.username,
            errors: "Password must be at least 8 characters"
        });
    }


});

/* GET login page */
router.get('/login', function(req, res, next) {
    if (!req.isAuthenticated()) {
        if (req.query.stat === 'failed') {
            res.render('login', {
                errors: "Incorrect username or password"
            });
        }
        else {
            res.render('login', {
                errors: ""
            });
        }
    }
    else {
        res.redirect('/');
    }
});
/* POST login page */
router.post('/login',
    function(req, res, next) {
        if (req.body.rememberMe) {
            req.session.cookie.maxAge = config.cookieMaxAge;
        }
        next();
    },
    passport.authenticate('local', {
        failureRedirect: '/login?stat=failed',
        successRedirect: '/app.html',
        failureFlash: 'Invalid credentials'
    }));

/* GET logout page */
router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


/* API CALLS, api calls will check what user is it.*/
router.get('/getuser', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.send(req.session.passport.user);
    }
    else {
        res.send("Not user");
    }
});

router.post('/postRcist', function(req, res, next) {

    if (req.isAuthenticated()) {
        PostService.addPost({
            username: req.session.passport.user,
            post: req.body.rcist
        }, function(err) {
            if (err) {
                res.send(JSON.stringify(err));
            }
            else {
                res.send("Posted");
            }
        });

    }
    else {
        res.send("Not Authenticated");
    }
});

router.get('/feed', function(req, res, next) {
    if (req.isAuthenticated()) {
        PostService.getFeed(function(feed) {
            res.send(feed);
        });
    }
    else {
        res.send("Not Authenticated");
    }
});

router.get('/user/:user', function(req, res, next) {
    if (req.isAuthenticated()) {
        PostService.findPostsByUser(req.params.user, function(err, feed) {
            if(err)
                res.send("Error");
            else
                res.send(feed);
        });
    }
    else {
        res.send("Not Authenticated");
    }
});

router.get('/agree/:id', function(req, res, next) {
    if (req.isAuthenticated()) {
        /* PostService, your on */
        PostService.agree(req.params.id, req.session.passport.user, function(err, raw) {
            if (err) {
                res.send("Error:" + err);
            }
            else {
                res.send("Agreed");
            }
        });
    }
    else {
        res.send("Not Authenticated");
    }
});

router.get('/disagree/:id', function(req, res, next) {

    if (req.isAuthenticated()) {
        /* PostService, your on */
        PostService.disagree(req.params.id, req.session.passport.user, function(err, raw) {
            if (err) {
                res.send("Error:" + err + ", " + raw);
            }
            else {
                res.send("Disagreed");
            }
        });
    }
    else {
        res.send("Not Authenticated");
    }
});
module.exports = router;
