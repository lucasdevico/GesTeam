'use strict';
app.factory('loginService', function($http, ngGesTeamSettings, $q, $window, jwtHelper, $location, $rootScope, timeService){
	var loginServiceFactory = {};
	var serviceBase = ngGesTeamSettings.apiServiceBaseUri;

	var _usuarioLogado = undefined;
	
	var _logon = function(authenticationData){
		var url = serviceBase + '/autenticar'
		var deferred = $q.defer();

		$http.post(url, {login: authenticationData.login, senha: authenticationData.senha})
        .success(function(response){
            deferred.resolve(response);
        }).error(function(err, status) {
        	var response = {
            	data: err,
            	status: status
            };
            deferred.reject(response);
        });

        return deferred.promise;
	};

	var _preencherDadosAutenticacao = function(){
		var tokenDecoded = null;
		var token = $window.sessionStorage.token;
		
		// Se existe o token na session
		if (token){

			// Valida se o token expirou
			if (jwtHelper.isTokenExpired(token)){
				delete $window.sessionStorage.token;
				$location.path('/login');
			}
			else {
				// Decodificar token
                tokenDecoded = jwtHelper.decodeToken(token);

                // Incluir o usuario logado no rootScope
                _usuarioLogado = tokenDecoded.usuarioLogado;

                // Se não possuir time selecionado
                if (!$window.sessionStorage.timeSelecionado){
                	$location.path('/login/selecionar-time');
                }
                else{
                	var idTimeSelecionado = $window.sessionStorage.timeSelecionado;

                	// Obter acesso ao time selecionado
			        // var acesso = JSON.parse(JSON.stringify($.grep(_usuarioLogado.acessos, function(x){
			        //     return x._time._id == idTimeSelecionado;
			        // })[0]));
           			// _usuarioLogado.timeSelecionado = acesso._time;

                	//## Carregar informações do time selecionado
                	timeService.obter(idTimeSelecionado).then(function(response){
                		_usuarioLogado.timeSelecionado = response.data;
                	});
                	//##
                }
            }

		}

	};

	var _selecionarTime = function(_timeSelecionado){
		$window.sessionStorage.timeSelecionado = _timeSelecionado;
	};

	var _logout = function(){
		_usuarioLogado = undefined;
		delete $window.sessionStorage.token;
		delete $window.sessionStorage.timeSelecionado;
		$location.path('/login');
	}

	var _obterUsuarioLogado = function(){
		//_preencherDadosAutenticacao();
		return _usuarioLogado;
	}

	loginServiceFactory.usuarioLogado = _obterUsuarioLogado;
	loginServiceFactory.logon = _logon;
	loginServiceFactory.preencherDadosAutenticacao = _preencherDadosAutenticacao;
	loginServiceFactory.selecionarTime = _selecionarTime;
	loginServiceFactory.logout = _logout;

	return loginServiceFactory;

});