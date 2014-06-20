'use strict';

angular.module('myApp.controllers')
    .controller('LoginController', ['$scope', 'DigestAuth', function($scope, DigestAuth){

        var FORM_URL = '/login/',
            REDIRECT_TO = '/projects/';

        // $scope
        // ======

        $scope.input = {};

        $scope.submitForm = function(isFormValid){

            if(isFormValid){
                DigestAuth.connect(FORM_URL, REDIRECT_TO, $scope.input.email, $scope.input.password);
            }
        };
    }]);
