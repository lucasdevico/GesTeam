var app = angular.module('gesteam', ['ngAnimate', 'ngRoute', 'ngResource', 'LocalStorageModule']);

var serviceBase = 'http://localhost:3000';
var apiCorreiosBase = 'http://api.postmon.com.br/v1/cep/';

app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
    }); 

    $routeProvider.when('/cadastro', {
        templateUrl: 'partials/cadastro.html',
        controller: 'CadastroController'
    }); 

    $routeProvider.otherwise({redirectTo: '/'});

});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
});

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    apiCorreiosBaseUri: apiCorreiosBase
});