'use strict';
/*jshint -W079 */

Backbone.Marionette.Renderer.render = function(template, data){
    return template(data);
};


var PortfolioManager = new Marionette.Application();

PortfolioManager.addRegions({
    containerRegion: '#containerRegion',
    asideRegion: '#asideRegion'
});

PortfolioManager.on('start', function(){

    Backbone.history.start();

    if(Backbone.history.fragment === ''){
        PortfolioManager.trigger('projects:list');
    }
});
