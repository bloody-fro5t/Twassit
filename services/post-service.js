var Post = require('../models/post').Post;

exports.addPost = function(rcist, next) {


    var newPost = new Post({
        username: rcist.username.toLowerCase(),
        post: rcist.post,
        agree: [],
        disagree: []
    });

    newPost.save(function(err) {
        if (err) {
            return next(err);
        }
        next(null);
    });

};
/*API CALLS */
exports.findPostsByUser = function(username, next) {
    Post.find({
        username: username.toLowerCase()
    }, function(err, user) {
        next(err, user);
    });

};

exports.getFeed = function(next) {
    Post.find({}, function(err, feed) {
        if (err)
            next(err);
        else
            next(feed);
    });
};

exports.agree = function(id, username, next) {
    Post.find({
        _id: id
    }, function(err, post) {
        if (err) return err;

        if (username !== post[0].username && post[0].agree.indexOf(username) === -1) {
            Post.findByIdAndUpdate(id, {
                $push: {
                    "agree": username
                }
            }, function(err, raw) {
                if (err) {
                    next(err, null);
                }
                else {
                    next(err, raw);
                }
            });
        }
        else {
            next(err, null);
        }
    });


};

exports.disagree = function(id, username, next) {
    Post.find({
        _id: id
    }, function(err, post) {
        if (err) return err;
        if (username !== post[0].username && post[0].disagree.indexOf(username) === -1) {
            Post.findByIdAndUpdate(id, {
                $push: {
                    "disagree": username
                }
            }, function(err, raw) {
                if (err) {
                    next(err, null);
                }
                else {
                    next(err, raw);
                }
            });
        }
        else {
            next(err, null);
        }
    });


};