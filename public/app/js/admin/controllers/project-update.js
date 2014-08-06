'use strict';

angular.module('myApp.controllers')
    .controller('ProjectUpdateController', ['$scope', '$routeParams', '$location', '$http', 'Project', 'MediaManager', function($scope, $routeParams, $location, $http, Project, MediaManager){

        var filesArray = [],
            creditsTag = [];

        var arrayUnique = function(array){
            var a = array.concat();

            for(var i=0, len=a.length; i<len; ++i){
                for(var j=i+1, l=a.length; j<l; ++j){
                    if(a[i] === a[j]){
                        a.splice(j--, 1);
                    }
                }
            }

            return a;
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

        $scope.updateProject = function(){

            $scope.data.success = false;
            $scope.data.project.$update(function(){
                $scope.data.success = true;
            });
        };

        $scope.submitForm = function(isFormValid){

            if(isFormValid){
                $scope.data.project.media = arrayUnique($scope.data.project.media.concat(filesArray));
                $scope.data.project.media = arrayUnique($scope.data.project.media.concat($scope.data.vimeo));
                $scope.updateProject();
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

            if($scope.data.project.media.length === 0){
                $scope.data.isShowingInfo = true;
            }

            $scope.updateProject();
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

        $http.get('/api/credits').success(function(data){
            creditsTag = data;
        });

        $scope.select2CreditsOptions = {
            tags: function(){
                return creditsTag;
            },
            multiple: true,
            'simple_tags': true,
            tokenSeparators: [',']
        };


        // $http.get('/api/teams').success(function(data){

            $scope.select2TeamOptions = {
                'tags': [],
                'multiple': true,
                'simple_tags': true,
                'tokenSeparators': [',']
            };
        // });

        // $http.get('/api/technicals').success(function(data){

            $scope.select2TechnicalOptions = {
                'tags': [],
                'multiple': true,
                'simple_tags': true,
                'tokenSeparators': [',']
            };
        // });
    }]);
