app.factory('timeService', ['$http', 'ngGesTeamSettings', '$q', function($http, ngGesTeamSettings, $q){
	var timeServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;

	var _obter = function(_id){
		var url = serviceBase + '/time/obter/' + _id;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	var _atualizar = function(_time){
		var url = serviceBase + '/time/atualizar/' + _time._id;
		return $http.put(url, _time).then(function(response){
			return response;
		});
	}
	
	var _verificarNomeTimeExistente = function(_nomeTime){
		var url = serviceBase + '/time/verificarNomeTimeExistente/' + _nomeTime;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	timeServiceFactory.verificarNomeTimeExistente = _verificarNomeTimeExistente;
	timeServiceFactory.atualizar = _atualizar;
	timeServiceFactory.obter = _obter;

	return timeServiceFactory;

}]);