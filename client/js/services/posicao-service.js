app.factory('posicaoService', ['$http', 'ngGesTeamSettings', '$q', function($http, ngGesTeamSettings, $q){
	var statusServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;

	statusServiceFactory.listar = function(_modalidade){
		var url = serviceBase + '/posicao/listar/' + _modalidade;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	statusServiceFactory.obter = function(_id){
		var url = serviceBase + '/posicao/obter/' + _id;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	return statusServiceFactory;

}]);