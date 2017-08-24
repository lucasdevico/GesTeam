app.factory('utilsService', ['$http', 'ngAuthSettings', '$q', function($http, ngAuthSettings, $q){
	var utilsServiceFactory = {};
	var serviceBase = ngAuthSettings.apiServiceBaseUri;
	
	var _listarEstados = function(){
		var url = serviceBase + '/utils/listarEstados';
		return $http.get(url).then(function(response){
			return response;
		});
	}

	var _listarCidades = function(_siglaEstado){
		var url = serviceBase + '/utils/listarCidades';
		return $http.get(url, { params: { siglaEstado: _siglaEstado } }).then(function(response){
			return response;
		});
	}

	utilsServiceFactory.listarEstados = _listarEstados;
	utilsServiceFactory.listarCidades = _listarCidades;

	return utilsServiceFactory;

}]);