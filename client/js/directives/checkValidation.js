angular.module('gesteam').directive('checkValidationComplete', ['$window', '$parse', function ($window, $parse){
    var options = {};

    return {
        restrict: 'A',
        require: 'form',
        link: function (scope, element, attributes)
        {
            var fn  = $parse(attributes.checkValidationComplete);
            var opts = angular.extend({}, options, scope.$eval(attributes.checkValidationOptions));

            element.validationEngine('attach', opts);

            element.bind('submit', function (event)
            {
                if(!element.validationEngine('validate'))
                {
                    return false;
                }

                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });

            angular.element($window).bind('resize', function()
            {
                element.validationEngine('updatePromptsPosition');
            });
        }
    };
}]);