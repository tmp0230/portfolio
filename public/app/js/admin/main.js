'use strict';

angular.module('myApp', ['ngRoute', 'ngResource', 'myApp.controllers', 'myApp.directives', 'myApp.services'])
    .config(['$routeProvider', function($routeProvider){

        var checkLoggedIn = function($q, $http, $location){
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: '/loggedin/'
            }).success(function(){
                defer.resolve();
            }).error(function(){
                defer.reject();
                $location.path('/login/');
            });

            return defer.promise;
        };

        $routeProvider
            .when('/login/', {
                templateUrl: '/static/templates/admin/login.html',
                controller: 'LoginController'
            })
            .when('/join/', {
                templateUrl: '/static/templates/admin/join.html',
                controller: 'JoinController'
            })
            .when('/projects/', {
                templateUrl: '/static/templates/admin/project-list.html',
                controller: 'ProjectListController',
                resolve: {
                    loggedin: checkLoggedIn
                }
            })
            .when('/projects/:project_id/', {
                templateUrl: '/static/templates/admin/project-form.html',
                controller: 'ProjectFormController',
                resolve: {
                    loggedin: checkLoggedIn
                }
            })
            .otherwise({redirectTo: '/projects/'});
    }]);

angular.module('myApp.controllers', []);
angular.module('myApp.directives', []);
angular.module('myApp.services', []);
