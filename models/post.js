var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userService = require('../services/user-service');

var postSchema = new Schema({
    username: {
        type: String,
        require: "Username is required"
    },
    post: {
        type: String,
        require: "Post is required"
    },
    timestamp: {
        type: Date,
        'default': Date.now,
        require: "Timestamp is required"
    },
    agree: {
        type: [String],
        require: "The agree list is required"
    },
    disagree: {
        type: [String],
        require: "The disagree list is required"
    }
});

postSchema.path('username').validate(function(value, next) {
    userService.userExists(value, function(err, user) {
        if (err) {
            console.log(err);
            return next(false);
        }
        next(user);
    });
}, 'You must have an exist user');

postSchema.path('post').validate(function(value, next) {
    if (value.length < 140)
        next(value);
    else
        next(!value);
}, 'Max 140 characters');

var Post = mongoose.model('Post', postSchema);

module.exports = {
    Post: Post
};