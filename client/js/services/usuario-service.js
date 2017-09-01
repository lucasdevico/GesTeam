app.factory('usuarioService', ['$http', 'ngGesTeamSettings', '$q', function($http, ngGesTeamSettings, $q){
	var usuarioServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;
	
	var _verificarLoginExistente = function(_login){
		var url = serviceBase + '/usuario/verificarLoginExistente/' + _login;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	var _verificarEmailExistente = function(_email){
		var url = serviceBase + '/usuario/verificarEmailExistente/' + _email;
		return $http.get(url).then(function(response) {
		   return response;
		});
	}

	var _cadastrar = function(_novoCadastro){
		var url = serviceBase + '/usuario/cadastrar';
		return $http.post(url, _novoCadastro).then(function(response) {
		   return response;
		});	
	}

	usuarioServiceFactory.verificarLoginExistente = _verificarLoginExistente;
	usuarioServiceFactory.verificarEmailExistente = _verificarEmailExistente;
	usuarioServiceFactory.cadastrar = _cadastrar

	return usuarioServiceFactory;

}]);