'use strict';

angular.module('myApp.directives')
    .directive('myInputSpeller', function(){

        var link = function(scope, el){

            el.on('keypress', function(evt){

                if(evt.keyCode === 44){
                    el.prepend('<div class="input-group-addon">'+el.val()+'</div>');
                }
            });
        };

        return {
            restrict: 'A',
            link: link
        };
    });
