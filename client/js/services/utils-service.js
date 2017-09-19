'use strict';
app.factory('utilsService', function($http, ngGesTeamSettings, $q, Upload, loginService, $rootScope){
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

	var _uploadSimbolo = function(_arquivoSimbolo){
		var urlUpload = serviceBase + '/utils/simbolo/upload';
		//$rootScope.initLoading();

		console.log(loginService.usuarioLogado());

		Upload.upload({
            url: urlUpload, //webAPI exposed to upload the file
            data: { 
            	file: _arquivoSimbolo
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                alert('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
            } else {
                alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            alert('Error status: ' + resp.status);
        }, function (evt) { 
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $rootScope.refreshLoading(progressPercentage);
        });
	}

	utilsServiceFactory.listarEstados = _listarEstados;
	utilsServiceFactory.listarCidades = _listarCidades;
	utilsServiceFactory.buscarLocalizacaoPeloCEP = _buscarLocalizacaoPeloCEP;
	utilsServiceFactory.uploadSimbolo = _uploadSimbolo;

	return utilsServiceFactory;

});