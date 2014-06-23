'use strict';

angular.module('myApp.directives')
    .directive('myDragList', function(){

        var link = function(scope, el){

            el.sortable({
                update: function(){
                    scope.$apply(function(){
                        scope.data.saveSort = true;
                    });
                }
            });
        };

        return {
            restrict: 'A',
            link: link
        };
    });
