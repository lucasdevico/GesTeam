app.directive('menuPrincipal', function() {
	var ddo = {};

	ddo.restrict = "AE";
	ddo.transclude = true;

	ddo.scope = {
		time: '=',
		usuario: '='
	};

	ddo.templateUrl = 'js/directives/templates/menuPrincipal.html';

	ddo.link = function(scope, element, attrs){
	}

	return ddo;
});