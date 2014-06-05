var mongoose = require('mongoose'),

    ProjectSchema = new mongoose.Schema({
        title: {type: String, required: true},
        slug: {type: String, required: true, unique: true}
        description: String,
        date: Date,
        link: {type: String, lowercase: true},
        technical: String,
        team: String,
        credits: String,
        publish: {type: Boolean, required: true}
    });

    ProjectSchema.pre('save', function(next){

        this.slug = this.title.toLowerCase()
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
            .replace(/\-\-+/g, '-')     // Replace multiple - with single -
            .replace(/^-+/, '')         // Trim - from start of text
            .replace(/-+$/, '');        // Trim - from end of text

        next();
    };

module.exports = mongoose.model('Project', ProjectSchema);
