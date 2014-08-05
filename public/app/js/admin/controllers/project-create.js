// TODO: Add bootstrap load button mode

'use strict';

angular.module('myApp.controllers')
    .controller('ProjectCreateController', ['$scope', '$location', 'Project', 'MediaManager', function($scope, $location, Project, MediaManager){

        var filesArray = [];

        // $scope
        // ======

        $scope.input = {};
        $scope.data = {};
        $scope.data.menuCreate = true;
        $scope.data.isShowingInfo = true;
        $scope.data.vimeo = [{}];
        $scope.data.file = [{}];

        $scope.onFileSelect = function(files){

            MediaManager.onFileSelect(files, filesArray);
        };

        $scope.submitForm = function(isFormValid){

            if(isFormValid){

                var project = new Project($scope.input);
                project.media = filesArray.concat($scope.data.vimeo);

                project.$save(function(proj){
                    $location.path('/projects/'+proj._id+'/');
                });
            }
        };

        $scope.addField = function(type){

            MediaManager.addField(type, $scope.data.file, $scope.data.vimeo);
        };

        $scope.select2Options = {
            tags: ['test'],
            tokenSeparators: [',']
        };
    }]);
