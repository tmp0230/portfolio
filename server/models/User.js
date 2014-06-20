'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),

    UserSchema = new mongoose.Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    });

    UserSchema.pre('save', function(next){

        this.password = crypto.createHash('md5').update(this.password).digest('hex');

        next();
    });

module.exports = mongoose.model('User', UserSchema);
