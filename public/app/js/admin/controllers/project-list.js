'use strict';

angular.module('myApp.controllers')
    .controller('ProjectListController', ['$scope', 'Projects', function($scope, Projects){

        // $scope
        // ======

        $scope.data = {};
        $scope.data.saveSort = false;

        $scope.deleteProject = function(id, name){

            if(confirm('Are you sure you want to delete '+name+' ?')){
                Projects.delete({id: id});
            }
        };
    }]);
