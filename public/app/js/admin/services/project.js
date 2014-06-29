'use strict';

angular.module('myApp.services')
    .factory('Project', ['$resource', function($resource){

        return $resource('/api/projects/:projectId', {
            projectId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);
