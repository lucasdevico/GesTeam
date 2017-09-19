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
		$(".page-sidebar").addClass("page-sidebar-fixed");
		$(".page-sidebar").addClass("scroll").mCustomScrollbar("update");
		$(".scroll").mCustomScrollbar({axis:"y", autoHideScrollbar: true, scrollInertia: 20, advanced: {autoScrollOnFocus: false}});
		$(window).resize();
	}

	return ddo;
});