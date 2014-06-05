var mongoose = require('mongoose'),
    crypto = require('crypto'),

    UserSchema = new mongoose.Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    });

    /*UserSchema.methods.generateHash = function(password){
        this.password = crypto.createHash('sha1').update(password).digest('hex');
    };*/

    /*UserSchema.methods.checkHash = function(password){
        if( crypto.createHash('sha1').update(password).digest('hex') === this.password ) return true;
        return false;
    };*/

module.exports = mongoose.model('User', UserSchema);
