'use strict';

PortfolioManager.module('ProjectApp.Controller.List', function(List, PortfolioManager){

    // Public
    // ======

    List.projects = function(){

       var projects = PortfolioManager.request('projects:entities:list');

        // If projects isn't ready, we create a promise

        if( projects.promise ){

            $.when(projects).then( function(data){

                displayList(data);
            });
        }
        else{

            // Otherwhile render it directly

            displayList(projects);
        }
    };


    // Private
    // =======

    var displayList = function(projects){

        var projectListView = new ProjectList({
            collection: projects
        });
        //
        // AmadeusManager.projectRegion.show(projectListView);
    };
});
