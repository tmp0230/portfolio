'use strict';

PortfolioManager.module('ProjectApp.Controller.Show', function(Show, PortfolioManager){

    // Public
    // ======

    Show.project = function(slug){

       var project = PortfolioManager.request('projects:entities:show', slug);

        // If project isn't ready, we create a promise

        if( project.promise ){

            $.when(project).then( function(data){

                displaySingle(data);
            });
        }
        else{

            // Otherwhile render it directly

            displaySingle(project);
        }
    };


    // Private
    // =======

    var displaySingle = function(project){

        // var projectListView = new ProjectList({
        //     collection: projects
        // });
        //
        // AmadeusManager.projectRegion.show(projectListView);
    };
});
