'use strict';

angular.module('myApp.services')
    .service('MediaManager', ['$upload', '$rootScope', function($upload, $rootScope){

        // Public
        // ======

        this.addField = function(type, arrayFile, arrayVimeo){

            var arrayType;

            if(type === 'file'){
                arrayType = arrayFile;
            }
            else{
                arrayType = arrayVimeo;
            }

            arrayType.unshift({});
        };

        this.onFileSelect = function(files, filesArray){

            $rootScope.upload = $upload.upload({
                url: '/upload/',
                file: files
            }).success(function(data){

                filesArray.push({
                    imgSrc: data.name,
                    imgName: data.originalname
                });
            }).error(function(){

                alert('it failed');
            });
        };
    }]);
