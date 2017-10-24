app.directive('menuPrincipal', function($location, $rootScope, $route) {
	var ddo = {};

	ddo.restrict = "AE";
	ddo.transclude = true;

	ddo.scope = {
		time: '=',
		usuario: '=',
		ativo: '@'
	};

	ddo.templateUrl = 'js/directives/templates/menuPrincipal.html';

	ddo.link = function(scope, element, attrs){
		$(".page-sidebar").addClass("page-sidebar-fixed");
		$(".page-sidebar").addClass("scroll").mCustomScrollbar("update");
		$(".scroll").mCustomScrollbar({axis:"y", autoHideScrollbar: true, scrollInertia: 20, advanced: {autoScrollOnFocus: false}});
		$(window).resize();

		if(!attrs.ativo){
			$('.mnu-1').addClass('active');
		}
		else{
			$('.' + attrs.ativo).addClass('active');	
		}

		scope.abrirMenu = function(_location, $event){
			var element = $event.currentTarget;

			//## Limpar item ativo
			$('.x-navigation').find('li').removeClass('active');

			//## Ativar item clicado
			$(element).parent().addClass('active');

			if (_location){
				$location.path(_location);
				$route.reload();
			}
		};

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