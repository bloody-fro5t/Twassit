var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userService = require('../services/user-service');

var userSchema = new Schema({
    username: {
        type: String,
        require: "Username is required"
    },
    password: {
        type: String,
        require: "Password is required"
    }
});

userSchema.path('username').validate(function(value, next) {
    userService.userExists(value, function(err, user) {
        if (err) {
            console.log(err);
            return next(false);
        }
        next(!user);
    });
}, 'That username is already in use');

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};