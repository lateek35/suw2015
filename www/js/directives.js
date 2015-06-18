angular.module('starter.directives', [])

.directive('cameratake', function() {
 return {
    restrict: 'E',
    scope : {},
    link: function(scope, elem) {
      console.log('test');
    }
  };
});
