'use strict';

PortfolioManager.module('ProjectApp', function(ProjectApp, PortfolioManager, Backbone, Marionette){

    ProjectApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '!/projects/': 'projectList',
            '!/projects/:slug/': 'projectShow'
        }
    });

    var API = {
        projectList: function(){


        },

        projectShow: function(slug){

            //PortfolioManager.execute();
        }
    };

    PortfolioManager.on('projects:list', function(){

        API.projectList();
    });

    PortfolioManager.on('projects:show', function(slug){

        API.projectShow(slug);
    });
});
