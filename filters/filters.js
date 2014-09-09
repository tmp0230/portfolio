var moment = require('moment');

module.exports = function(env){

    env.addFilter('date', function(str){
        return moment(str).format('MMMM YYYY');
    });
};
