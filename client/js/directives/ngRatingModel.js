app.directive('ngRatingModel', function($location, $rootScope, $route) {
    var ddo = {};
    
    ddo.restrict = "A";
    ddo.transclude = true;
    
    ddo.scope = {
        ngRatingModel: '=',
        ngRatingReadonly: '='
    };

    ddo.replace = true;

    ddo.link = function(scope, element, attrs){   
        var readonly = !scope.ngRatingReadonly ? false : true;
        $(element).raty({
            score: scope.ngRatingModel,
            readOnly: readonly,
            click: function(){
                var newValue = $(element).raty('score');
                scope.ngRatingModel = newValue;
                scope.$apply();
            }
        });
    }

    return ddo;    
});