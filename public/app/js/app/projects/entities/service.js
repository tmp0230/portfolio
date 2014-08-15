'use strict';

PortfolioManager.module('Entities', function(Entities, PortfolioManager){

    // Private
    // =======

    var projects = null,
        defer = $.Deferred();

    var ajaxCall = function(){

        // Create a collection

		projects = new Entities.ProjectCollection();

    	projects.fetch({
    	    success: function(data){

    	        defer.resolve(data);
    	    },
    	    error: function(){

    	    	console.error('Problem while fetching projects');
    	    }
    	});

    	return defer.promise();
    };

    Entities.addInitializer(function(){

        ajaxCall();
    });


    // Public
    // ======

    var API = {
        getProjectEntities: function(){

            // If the projects has not been resolved yet

        	if( defer.state() !== 'resolved' ){

        		return defer.promise();
            }

            // Else, directly return them

            return projects;
        },

        getProjectEntity: function(slug){

            // If the projects has not been resolved yet

        	if( defer.state() !== 'resolved' ){

                // Create another defer to call findWhere when the projects are loaded

                var deferAlone = $.Deferred();

        		$.when(defer).then( function(){
                    deferAlone.resolve( projects.findWhere({slug: slug}) );
                });

                return deferAlone.promise();
            }

            // Else directly return the good project

            return projects.findWhere({slug: slug});
        }
    };

    PortfolioManager.reqres.setHandler('projects:entities:list', function(){

        return API.getProjectEntities();
    });

    PortfolioManager.reqres.setHandler('projects:entities:show', function(slug){

        return API.getProjectEntity(slug);
    });
});
