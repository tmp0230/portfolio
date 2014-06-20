'use strict';

angular.module('myApp.controllers')
    .controller('JoinController', ['$scope', function($scope){

        var FORM_URL = '/login/',
            REDIRECT_TO = '/projects/';

        // $scope
        // ======

        $scope.input = {};

        $scope.submitForm = function(isFormValid){

            if(isFormValid){
                //$scope.input.name $scope.input.email $scope.input.password
            }
        };
    }]);
