var app = angular.module('gesteam', [
    'ngAnimate', 
    'ngRoute', 
    'ngResource', 
    'LocalStorageModule',
    'angular-hmac-sha512',
    'ngSanitize',
    'angular-jwt']);

// Settings
var serviceBase = 'http://localhost:3000';
var apiCorreiosBase = 'http://api.postmon.com.br/v1/cep/';
var regexLoginBase = /^[a-zA-Z0-9]+([_\.]?[a-zA-Z0-9]){5,24}$/i;
var cryptoSecretBase = "M4l13uFuTs4l";

app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
    }); 

    $routeProvider.when('/login/selecionar-time', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
    }); 

    $routeProvider.when('/cadastro', {
        templateUrl: 'partials/cadastro.html',
        controller: 'CadastroController'
    }); 

    $routeProvider.when('/principal', {
        templateUrl: 'partials/principal.html',
        controller: 'PrincipalController'
    }); 

    $routeProvider.otherwise({redirectTo: '/login'});

});

app.config(['$crypthmacProvider', function ($crypthmacProvider) {
    $crypthmacProvider.setCryptoSecret(cryptoSecretBase);
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
});

app.run(['loginService', function (loginService) {
    loginService.preencherDadosAutenticacao();
}]);


app.run(function($rootScope){

    $rootScope.initLoading = function(){
        $.mpb("show",{value: [0,50],speed: 5});
    };

    $rootScope.completeLoading = function(){
        $.mpb("update",{value: 100, speed: 5, complete: function(){            
            $(".mpb").fadeOut(200,function(){
                $(this).remove();
            });
        }});
    };

    $rootScope.cancelLoading = function(){
        $.mpb('destroy');
    };

    $rootScope.openModalError = function(erro, detalhes){
        $rootScope.cancelLoading();

        if (!erro){
            erro = "Erro não esperado.";
        }

        if (!detalhes){
            detalhes = "Por favor, tente novamente mais tarde.";
        }

        // Exibe modal
        var box = $("#mb-error");
        if(box.length > 0){
            box.toggleClass("open");
            box.find('#mb-error-descricao').empty().text(erro);
            box.find('#mb-error-detalhes').empty().text(detalhes);
        }
        return;
    };

    $rootScope.openModalSuccess = function(descricao, detalhes, fnCallback){
        $rootScope.completeLoading();

        if (!descricao){
            descricao = "";
        }

        if (!detalhes){
            detalhes = "";
        }

        // Exibe modal
        var box = $("#mb-success");
        if(box.length > 0){
            box.addClass("open");
            box.find('#mb-error-descricao').empty().text(descricao);
            box.find('#mb-error-detalhes').empty().text(detalhes);
            box.find('.mb-control-close').unbind('click').bind('click', function(){
                fnCallback();
                box.removeClass("open");
            });
        }
        return;
    };
});

app.constant('ngGesTeamSettings', {
    apiServiceBaseUri: serviceBase,
    apiCorreiosBaseUri: apiCorreiosBase,
    regexLogin: regexLoginBase
});