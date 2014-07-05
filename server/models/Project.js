'use strict';

var mongoose = require('mongoose'),

    TagSchema = new mongoose.Schema({
        name: {type: String, unique: true, required: true, sparse: true}, // sparse allows multiple null values with unique attribute
        link: {type: String, lowercase: true}
    }),

    MediaSchema = new mongoose.Schema({
        imgSrc: String,
        vimeoId: String
    }),

    ProjectSchema = new mongoose.Schema({
        title: {type: String, required: true},
        slug: {type: String, unique: true},
        description: String,
        date: Date,
        link: {type: String, lowercase: true},
        technical: [TagSchema],
        team: [TagSchema],
        credits: [TagSchema],
        media: [MediaSchema],
        position: Number,
        publish: {type: Boolean}
    });

    ProjectSchema.pre('save', function(next){

        this.slug = this.title.toLowerCase()
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
            .replace(/\-\-+/g, '-')     // Replace multiple - with single -
            .replace(/^-+/, '')         // Trim - from start of text
            .replace(/-+$/, '');        // Trim - from end of text

        next();
    });

module.exports = mongoose.model('Project', ProjectSchema);
