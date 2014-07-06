// TODO: Add bootstrap load button mode

'use strict';

angular.module('myApp.controllers')
    .controller('ProjectCreateController', ['$scope', '$location', 'Project', function($scope, $location, Project){

        // $scope
        // ======

        $scope.input = {};
        $scope.data = {};
        $scope.data.menuCreate = true;
        $scope.data.vimeo = [{}];
        $scope.data.file = [{}];

        $scope.submitForm = function(isFormValid){

            if(isFormValid){
                var project = new Project($scope.input);
                project.$save(function(proj){
                    $location.path('/projects/'+proj._id+'/');
                });
            }
        };

        $scope.addField = function(type){

            var arrayType;

            if(type === 'file'){
                arrayType = $scope.data.file;
            }
            else{
                arrayType = $scope.data.vimeo;
            }

            arrayType.unshift({});
        };
    }]);
