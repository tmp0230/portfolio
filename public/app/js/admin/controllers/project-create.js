// TODO: Add bootstrap load button mode

'use strict';

angular.module('myApp.controllers')
    .controller('ProjectCreateController', ['$scope', '$location', '$http', 'Project', 'MediaManager', 'TagManager', function($scope, $location, $http, Project, MediaManager, TagManager){

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

                for(var i = 0, len = project.media.length; i<len; i++){

                    if(Object.keys(project.media[i]).length === 1){
                        project.media.splice(i, 1);
                    }
                }

                project.$save(function(proj){
                    $location.path('/projects/'+proj._id+'/');
                });
            }
        };

        $scope.addField = function(type){

            MediaManager.addField(type, $scope.data.file, $scope.data.vimeo);
        };


        // Select2 Configuration
        // =====================

        $scope.select2Options = function(type){
            return TagManager.init(type);
        };
    }]);
