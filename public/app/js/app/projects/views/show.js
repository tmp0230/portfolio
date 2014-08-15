'use strict';

PortfolioManager.module('ProjectApp.View.Show', function(Show, PortfolioManager, Backbone, Marionette){

    Show.Item = Marionette.ItemView.extend({
        template: ['project-show']
    });
});
