'use strict';

angular.module('myApp.directives')
    .directive('myDragList', function(){

        var link = function(scope, el, attrs){

            el.sortable();
        };

        return {
            restrict: 'A',
            link: link
        };
    });
