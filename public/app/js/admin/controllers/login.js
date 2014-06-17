'use strict';

angular.module('myApp.controllers')
    .controller('LoginController', ['$scope', '$http', function($scope, $http){

        var FORM_URL = '/login/';

        var nc = 1,
            realm = null,
            nonce = null,
            cnonce = null;

        var clientAuth = function(){
            var passwordHash = $.md5($scope.input.password);
        };

        var generateClientNonce = function(){

            var characters = 'abcdef0123456789',
                charLength = characters.length,
                token = '',
                randNum = null;

            for(var i=0; i<16; i++){
                randNum = Math.round(Math.random() * charLength);
                token += characters.substr(randNum, 1);
            }

            cnonce = token;
        };

        var generateResponse = function(email, password){

            var ha1 = $.md5(email+':'+realm+':'+password),
                ha2 = $.md5('POST:'+FORM_URL),
                nc = ('00000000'+nc).slice(-8);

            return $.md5(ha1+':'+nonce+':'+nc+':'+cnonce+':auth:'+ha2);
        };

        var extractInfoHeader = function(res){

            var responseHeaders = res.getResponseHeader('WWW-Authenticate'),
                realmRegex = /realm="(.*?)"/i,
                nonceRegex = /nonce="(.*?)"/i;

            realm = realmRegex.exec(responseHeaders)[1];
            nonce = nonceRegex.exec(responseHeaders)[1];
        };

// $scope
// ======

        $scope.submitForm = function(){

            if(realm === null && nonce === null){

                $http({
                    method: 'POST',
                    url: FORM_URL,
                }).success(function(data, status){
                    if(status === 200){
                        $location.path('/projects/');
                    }
                    else if(status === 401){
                        clientAuth();
                    }
                });
            }
            else{

                clientAuth();
            }
        }
    }]);
