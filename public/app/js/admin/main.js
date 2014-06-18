'use strict';

angular.module('myApp', ['ngRoute', 'myApp.controllers', 'myApp.directives', 'myApp.services'])
    .config(['$routeProvider', function($routeProvider){
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
                controller: 'ProjectsController'
            })
            .otherwise({redirectTo: '/login/'});
    }]);

angular.module('myApp.controllers', []);
angular.module('myApp.directives', []);
angular.module('myApp.services', []);
