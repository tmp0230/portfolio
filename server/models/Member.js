'use strict';

var mongoose = require('mongoose'),

    MemberSchema = new mongoose.Schema({
        name: {type: String, required: true, unique: true},
    });

module.exports = mongoose.model('Keyword', MemberSchema);
