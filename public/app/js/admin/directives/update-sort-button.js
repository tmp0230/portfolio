'use strict';

angular.module('myApp.directives')
    .directive('myUpdateSortButton', ['Projects', function(){

        var link = function(scope, el){

            el.on('click', function(){
                var els = el.parent().find('tr');

                for(var i = 0, len = els.length; i<len; i++){
                    Projects.update({id: els.eq(i).data('projectId')});
                }
            });
        };

        return {
            restrict: 'A',
            link: link
        };
    }]);
