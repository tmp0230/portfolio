// TODO: Add bootstrap load button mode

'use strict';

angular.module('myApp.controllers')
    .controller('ProjectCreateController', ['$scope', '$location', 'Project', function($scope, $location, Project){

        // $scope
        // ======

        $scope.input = {};
        $scope.data = {};
        $scope.data.menuCreate = true;

        $scope.submitForm = function(isFormValid){

            if(isFormValid){
                var project = new Project($scope.input);
                project.$save(function(proj){
                    $location.path('/projects/'+proj._id+'/');
                });
            }
        };
    }]);
