'use strict';

angular.module('myApp.controllers')
    .controller('ProjectListController', ['$scope', function($scope){

        // $scope
        // ======

        $scope.deleteProject = function(){

            if(confirm('Are you sure you want to delete ?')){
                //call del
            }
        };
    }]);
