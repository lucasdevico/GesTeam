app.factory('errorInterceptor', function($q, $window, $location){
	var interceptor = {};

	interceptor.responseError = function(rejection){
		// if (rejection != null && rejection.status === 401){
		// 	$location.path('/error');
		// }
		return $q.reject(rejection);
	};

	return interceptor;
});