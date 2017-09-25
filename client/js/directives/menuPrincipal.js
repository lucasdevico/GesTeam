app.directive('menuPrincipal', function($location, $rootScope) {
	var ddo = {};

	ddo.restrict = "AE";
	ddo.transclude = true;

	ddo.scope = {
		time: '=',
		usuario: '='
	};

	ddo.templateUrl = 'js/directives/templates/menuPrincipal.html';

	ddo.link = function(scope, element, attrs){
		$(".page-sidebar").addClass("page-sidebar-fixed");
		$(".page-sidebar").addClass("scroll").mCustomScrollbar("update");
		$(".scroll").mCustomScrollbar({axis:"y", autoHideScrollbar: true, scrollInertia: 20, advanced: {autoScrollOnFocus: false}});
		$(window).resize();

		scope.direcionaSelecionarTime = function(){
			var urlAnterior = $location.url();

			$rootScope.$back = function(){
				$location.path(urlAnterior);
			}

			$location.path('/login/selecionar-time');
		}
	}

	return ddo;
});