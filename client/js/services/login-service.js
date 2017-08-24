app.factory('loginService', ['$http', 'ngAuthSettings', '$q', function($http, ngAuthSettings, $q){
	var loginServiceFactory = {};
	var serviceBase = ngAuthSettings.apiServiceBaseUri;
	
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

	loginServiceFactory.logon = _logon;

	return loginServiceFactory;

}]);