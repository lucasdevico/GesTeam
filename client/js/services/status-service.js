app.factory('statusService', ['$http', 'ngGesTeamSettings', '$q', function($http, ngGesTeamSettings, $q){
	var statusServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;

	statusServiceFactory.listar = function(_chave){
		var url = serviceBase + '/status/listar/' + _chave;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	statusServiceFactory.obter = function(_id){
		var url = serviceBase + '/status/obter/' + _id;
		return $http.get(url).then(function(response){
			return response;
		});
	}

	return statusServiceFactory;

}]);