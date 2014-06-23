'use strict';

angular.module('myApp.services')
    .factory('Projects', ['$resource', function($resource){

        return $resource('/api/projects/:projectId', {
            projectId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);
