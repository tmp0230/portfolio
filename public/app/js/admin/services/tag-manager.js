'use strict';

angular.module('myApp.services')
    .service('TagManager', ['$http', function($http){

        var creditTags = [],
            teamTags = [],
            technicalTags = [];

        $http.get('/api/credits').success(function(data){
            creditTags = data;
        });

        $http.get('/api/teams').success(function(data){
            teamTags = data;
        });

        $http.get('/api/technicals').success(function(data){
            technicalTags = data;
        });


        // Public
        // ======

        this.init = function(type){

            // Select2 Configuration
            // =====================

            return {
                tags: function(){
                    if(type === 'credits'){
                        return creditTags;
                    }
                    else if(type === 'team'){
                        return teamTags;
                    }
                    else if(type === 'technical'){
                        return technicalTags;
                    }
                },
                multiple: true,
                'simple_tags': true,
                tokenSeparators: [',']
            };
        };
    }]);
