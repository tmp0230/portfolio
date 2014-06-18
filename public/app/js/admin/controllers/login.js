'use strict';

angular.module('myApp.controllers')
    .controller('LoginController', ['$scope', 'DigestAuth', function($scope, DigestAuth){

        var FORM_URL = '/login/',
            REDIRECT_TO = '/projects/';

        // $scope
        // ======

        $scope.submitForm = function(){

            if(!this.headerExtracted){
                DigestAuth.askHeaderToken(FORM_URL, REDIRECT_TO, $scope.input.email, $scope.input.password);
            }
            else{
                DigestAuth.clientAuth(null, FORM_URL, REDIRECT_TO, $scope.input.email, $scope.input.password);
            }
        };
    }]);
