'use strict';

angular.module('myApp.controllers')
    .controller('ProjectListController', ['$scope', 'Project', function($scope, Project){

        // $scope
        // ======

        $scope.data = {};
        $scope.data.saveSort = false;
        $scope.data.menuList = true;
        $scope.data.projects = Project.query();

        $scope.updateSort = function(){
            
            for(var i = 0, len = $scope.data.projects.length; i < len; i++){
                $scope.data.projects[i].$update();
            }
        };

        $scope.deleteProject = function(project){

            if(confirm('Are you sure you want to delete '+project.title+' ?')){
                project.$delete(function(){
                    
                    // Remove it from client representation

                    var index = $scope.data.projects.indexOf(project);
                    $scope.data.projects.splice(index, 1);
                });
            }
        };

        $scope.sortableOptions = {
            update: function(){
                
                $scope.data.saveSort = true;

                for(var i = 0, len = $scope.data.projects.length; i < len; i++){
                    $scope.data.projects[i].position = i;
                }
            }
        };
    }]);
