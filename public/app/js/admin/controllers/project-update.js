'use strict';

angular.module('myApp.controllers')
    .controller('ProjectUpdateController', ['$scope', '$routeParams', '$location', 'Project', function($scope, $routeParams, $location, Project){

        // $scope
        // ======

        $scope.input = {};
        $scope.data = {};
        $scope.data.project = Project.get({projectId: $routeParams.projectId}, function(project){
            $scope.input = project;
        });

        $scope.submitForm = function(isFormValid){

            if(isFormValid){

            }
        };

        $scope.deleteProject = function(){

            if(confirm('Are you sure you want to delete '+$scope.data.project.title+' ?')){
                $scope.data.project.$delete(function(){
                    $location.path('/projects/');
                });
            }
        };
    }]);
