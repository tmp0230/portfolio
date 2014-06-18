'use strict';

angular.module('myApp.services')
    .sercice('DigestAuth', ['$http', '$location', function($http, $location){

        var nc = 1,
            realm = null,
            nonce = null,
            cnonce = null;

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

            var responseHeaders = headers('WWW-Authenticate'),
                realmRegex = /realm="(.*?)"/i,
                nonceRegex = /nonce="(.*?)"/i;

            realm = realmRegex.exec(responseHeaders)[1];
            nonce = nonceRegex.exec(responseHeaders)[1];
        };

        var generateResponse = function(email, password, FORM_URL){

            var ha1 = $.md5(email+':'+realm+':'+password),
                ha2 = $.md5('POST:'+FORM_URL),
                ncSlice = ('00000000'+nc).slice(-8);

            return $.md5(ha1+':'+nonce+':'+ncSlice+':'+cnonce+':auth:'+ha2);
        };

        // Public
        // ======

        this.headerExtracted = false;

        this.askHeaderToken = function(FORM_URL, REDIRECT_TO, email, password){

            $http({
                method: 'POST',
                url: FORM_URL
            }).success(function(data, status, headers){
                if(status === 200){
                    $location.path(REDIRECT_TO);
                }
                else if(status === 401){
                    this.clientAuth(headers, FORM_URL, REDIRECT_TO, email, password);
                }
            });
        };

        this.clientAuth = function(headers, FORM_URL, REDIRECT_TO, email, password){

            var passwordHash = $.md5(password);

            generateClientNonce();

            if(realm === null && nonce === null){
                extractInfoHeader(headers);

                this.headerExtracted = true;
            }

            var response = generateResponse(email, passwordHash, FORM_URL),
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
    }]);
