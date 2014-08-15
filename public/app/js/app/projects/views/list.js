'use strict';

PortfolioManager.module('ProjectApp.View.List', function(List, PortfolioManager, Backbone, Marionette){){

    List.Item = Marionette.ItemView.extend({
        template: ['project-list']
    });
});
