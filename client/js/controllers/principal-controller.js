'use strict';
app.controller('PrincipalController', function($scope, loginService, $location) {
	var me = $scope;
	$scope.usuario = loginService.usuarioLogado();
	$scope.formControls = {};

	$scope.verificaAcesso = function(){
		if (!$scope.usuario){
			loginService.logout();
			$location.path('/redirecting');
		}
	}

	// load
	$scope.$on('$viewContentLoaded', function(){
		
	});

	$scope.verificaAcesso();
});