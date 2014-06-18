'use strict';

angular.module('myApp.controllers')
    .controller('LoginController', ['$scope', function($scope){

        var FORM_URL = '/login/',
            REDIRECT_TO = '/projects/';

        var nc = 1,
            realm = null,
            nonce = null,
            cnonce = null;

        var askHeaderToken = function(){

            $http({
                method: 'POST',
                url: FORM_URL
            }).success(function(data, status, headers){
                if(status === 200){
                    $location.path(REDIRECT_TO);
                }
                else if(status === 401){
                    clientAuth(headers);
                }
            });
        };

        var clientAuth = function(headers){

            var email = $scope.input.email,
                passwordHash = $.md5($scope.input.password);

            generateClientNonce();

            if(realm === null && nonce === null) extractInfoHeader(headers);

            var response = generateResponse(email, passwordHash),
                nc = ('00000000'+nc).slice(-8),
                digestHeader =  'Digest username="'+email+'", '+
                                'realm="'+realm+'", '+
                                'nonce="'+nonce+'", '+
                                'uri="'+FORM_URL+'", '+
                                'qop=auth, '+
                                'nc='+nc+', '+
                                'cnonce="'+cnonce+'", '+
                                'response="'+response+'"';

            $http({
                method: 'POST',
                url: FORM_URL,
                headers: {
                    'Authorization': digestHeader
                }
            }).success(function(data, status, headers){
                if(status === 200){
                    $location.path(REDIRECT_TO);
                }
                else if(status === 401){
                    extractInfoHeader(headers);
                }
            });
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

        var extractInfoHeader = function(headers){

            var responseHeaders = headers.getResponseHeader('WWW-Authenticate'),
                realmRegex = /realm="(.*?)"/i,
                nonceRegex = /nonce="(.*?)"/i;

            realm = realmRegex.exec(responseHeaders)[1];
            nonce = nonceRegex.exec(responseHeaders)[1];
        };

        var generateResponse = function(email, password){

            var ha1 = $.md5(email+':'+realm+':'+password),
                ha2 = $.md5('POST:'+FORM_URL),
                nc = ('00000000'+nc).slice(-8);

            return $.md5(ha1+':'+nonce+':'+nc+':'+cnonce+':auth:'+ha2);
        };

// $scope
// ======

        $scope.submitForm = function(){

            if(realm === null && nonce === null){
                askHeaderToken();
            }
            else{
                clientAuth();
            }
        }
    }]);
