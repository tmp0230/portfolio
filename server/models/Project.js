var mongoose = require('mongoose'),

    ProjectSchema = new mongoose.Schema({
        title: String,
        description: String,
        date: Date,
        link: String,
        technical: String,
        team: String,
        credits: String,
        publish: Boolean
    });

module.exports = mongoose.model('Project', ProjectSchema);
