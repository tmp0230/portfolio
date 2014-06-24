'use strict';

var mongoose = require('mongoose'),

    TagSchema = new mongoose.Schema({
        name: {type: String, required: true, unique: true},
        link: {type: String, lowercase: true}
    });

module.exports = mongoose.model('Tag', TagSchema);
