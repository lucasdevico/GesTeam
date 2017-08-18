angular.module('gesteam', ['ngAnimate', 'ngRoute'])
.config(function($routeProvider, $locationProvider, $httpProvider) {

    //$httpProvider.interceptors.push('tokenInterceptor');
    $routeProvider.when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
    }); 

    $routeProvider.otherwise({redirectTo: '/'});

});