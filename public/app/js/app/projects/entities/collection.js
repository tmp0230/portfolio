'use strict';

PortfolioManager.module('Entities', function(Entities, PortfolioManager, Backbone){

    Entities.ProjectCollection = Backbone.Collection.extend({
        url: '/api/projects',
        model: Entities.Project,
        comparator: '-date'
    });
});
