'use strict';
app.controller('PrincipalController', function($scope, loginService) {
	var me = $scope;
	$scope.usuario = loginService.usuarioLogado();
	$scope.formControls = {};

	$scope.load = function(){
		initX_navigation();
	}

	$scope.$on('$viewContentLoaded', function(){
	});

	$scope.load();
});