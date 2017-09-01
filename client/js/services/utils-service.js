app.factory('utilsService', ['$http', 'ngGesTeamSettings', '$q', function($http, ngGesTeamSettings, $q){
	var utilsServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;
	
	var _listarEstados = function(){
		var url = serviceBase + '/utils/listarEstados';
		return $http.get(url).then(function(response){
			return response;
		});
	}

	var _listarCidades = function(_siglaEstado){
		var url = serviceBase + '/utils/listarCidades/' + _siglaEstado;
		return $http.get(url).then(function(response) {
		   return response;
		});
	}

	var _buscarLocalizacaoPeloCEP = function(_cep){
		var url = ngAuthSettings.apiCorreiosBaseUri;
		return $http.get(url + _cep).then(function(response) {
		 	return response;
		});	
	}

	utilsServiceFactory.listarEstados = _listarEstados;
	utilsServiceFactory.listarCidades = _listarCidades;
	utilsServiceFactory.buscarLocalizacaoPeloCEP = _buscarLocalizacaoPeloCEP;

	return utilsServiceFactory;

}]);