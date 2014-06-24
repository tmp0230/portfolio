'use strict';

angular.module('myApp.controllers')
    .controller('ProjectListController', ['$scope', 'Projects', function($scope, Projects){

        // $scope
        // ======

        $scope.data = {};
        $scope.data.saveSort = false;

        $scope.deleteProject = function(project){

            if(confirm('Are you sure you want to delete '+project.name+' ?')){
                project.$delete();
            }
        };
    }]);
