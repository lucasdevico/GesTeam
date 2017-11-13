app.directive('ngRatingModel', function($location, $rootScope, $route) {
    var ddo = {};
    
    ddo.restrict = "A";
    ddo.transclude = true;
    
    ddo.scope = {
		ngRatingModel: '='
    };

    ddo.replace = true;

    ddo.link = function(scope, element, attrs){   
        $(element).raty({
            score: scope.ngRatingModel,
            click: function(){
                var newValue = $(element).raty('score');
                scope.ngRatingModel = newValue;
                scope.$apply();
            }
        });
    }

    return ddo;    
});