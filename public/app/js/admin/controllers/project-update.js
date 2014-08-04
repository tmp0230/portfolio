'use strict';

angular.module('myApp.controllers')
    .controller('ProjectUpdateController', ['$scope', '$routeParams', '$location', 'Project', 'MediaManager', function($scope, $routeParams, $location, Project, MediaManager){

        var filesArray = [];

        var updateProject = function(){

            $scope.data.success = false;

            //$scope.data.project.media = filesArray.concat($scope.data.vimeo);

            $scope.data.project.$update(function(){
                $scope.data.success = true;
            });
        };

        // $scope
        // ======

        $scope.input = {};
        $scope.data = {};
        $scope.data.saveSort = false;
        $scope.data.isShowingInfo = true;
        $scope.data.vimeo = [{}];
        $scope.data.file = [{}];

        $scope.data.project = Project.get({projectId: $routeParams.projectId}, function(project){
            $scope.input = project;

            filesArray = project.media;
        });

        $scope.submitForm = function(isFormValid){

            if(isFormValid){
                updateProject();
            }
        };

        $scope.deleteProject = function(){

            if(confirm('Are you sure you want to delete '+$scope.data.project.title+' ?')){

                $scope.data.project.$delete(function(){
                    $location.path('/projects/');
                });
            }
        };

        $scope.addField = function(type){

            MediaManager.addField(type, $scope.data.file, $scope.data.vimeo);
        };

        $scope.onFileSelect = function(files){

            MediaManager.onFileSelect(files, filesArray);
        };

        $scope.showTab = function(type){

            if(type === 'information'){
                $scope.data.isShowingInfo = true;
            }
            else if(type === 'media'){
                $scope.data.isShowingInfo = false;
            }
        };

        $scope.deleteMedia = function(media){

            // Remove it from client representation

            var index = $scope.data.project.media.indexOf(media);
            $scope.data.project.media.splice(index, 1);

            updateProject();
        };

        $scope.sortableOptions = {
            update: function(){

                $scope.data.saveSort = true;

                $scope.$watch('data.project.media', function(){

                    for(var i=0, len=$scope.data.project.media.length; i<len; i++){
                        $scope.data.project.media[i].position = i;
                    }
                });
            }
        };
    }]);
