app.factory('timeService', ['$http', 'ngGesTeamSettings', '$q', function($http, ngGesTeamSettings, $q){
	var timeServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;
	
	var _verificarNomeTimeExistente = function(_nomeTime){
		var url = serviceBase + '/time/verificarNomeTimeExistente/' + _nomeTime;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	timeServiceFactory.verificarNomeTimeExistente = _verificarNomeTimeExistente;

	return timeServiceFactory;

}]);