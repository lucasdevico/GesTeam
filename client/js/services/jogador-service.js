app.factory('jogadorService', ['$http', 'ngGesTeamSettings', '$q', function($http, ngGesTeamSettings, $q){
	var usuarioServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;

	usuarioServiceFactory.listar = function(_idTime, _pePreferido, _status, _posicao){
		var url = serviceBase + '/jogadores/listar/' + _idTime + "/" + _pePreferido + "/" + _status + "/" + _posicao;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	usuarioServiceFactory.obter = function(_id){
		var url = serviceBase + '/jogadores/obter/' + _id;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	usuarioServiceFactory.cadastrar = function(_jogador){
		var url = serviceBase + '/jogadores/inserir';
		return $http.post(url, _jogador).then(function(response) {
		   return response;
		});	
	}

	usuarioServiceFactory.atualizar = function(_jogador){
		var url = serviceBase + '/jogadores/atualizar/' + _jogador._id;
		return $http.put(url, _jogador).then(function(response) {
		   return response;
		});	
	}

	usuarioServiceFactory.excluir = function(_id){
		var url = serviceBase + '/jogadores/excluir/' + _id;
		return $http.post(url).then(function(response) {
		   return response;
		});
	}

	return usuarioServiceFactory;

}]);