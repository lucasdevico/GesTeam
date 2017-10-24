var app = angular.module('gesteam', [
    'ngAnimate', 
    'ngRoute', 
    'ngResource', 
    'LocalStorageModule',
    'angular-hmac-sha512',
    'ngSanitize',
    'angular-jwt',
    'ui.bootstrap',
    'colorpicker.module',
    'ngFileUpload']);
    //'ui.bootstrap.datetimepicker']);

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

    $routeProvider.when('/time/editar', {
        templateUrl: 'partials/time.html',
        controller: 'TimeController'
    }); 

    $routeProvider.when('/usuario/editar', {
        templateUrl: 'partials/usuario.html',
        controller: 'UsuarioController'
    });

    $routeProvider.when('/jogadores', {
        templateUrl: 'partials/jogador.html',
        controller: 'JogadorController'
    });

    $routeProvider.otherwise({redirectTo: '/login'});

});

app.config(['$crypthmacProvider', function ($crypthmacProvider) {
    $crypthmacProvider.setCryptoSecret(cryptoSecretBase);
}]);

app.config( function ( $tooltipProvider ) {
  $tooltipProvider.options({ appendToBody: true });
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
});

app.run(['loginService', function (loginService) {
    loginService.preencherDadosAutenticacao();
}]);


app.run(function($rootScope){

    $rootScope.initLoading = function(){
        $.mpb("show",{value: [0,50], speed: 5});
    };

    $rootScope.refreshLoading = function(percentage){
        $.mpb("update",{value: percentage, speed: 5, complete: function(){
            if (percentage == 100){
                $(".mpb").fadeOut(200,function(){
                    $(this).remove();
                });
            }
        }});
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
            box.find('#mb-error-detalhes').empty().html(detalhes);
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
            box.find('#mb-error-detalhes').empty().html(detalhes);
            box.find('.mb-control-close').unbind('click').bind('click', function(){
                if (fnCallback)
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

app.directive('datetimepicker', function($filter){
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModel){
            //if(!ngModel) return; // do nothing if no ng-model

            //ngModel.$formatters.shift();
            //ngModel.$render = function(){
                //element.find('input').val( ngModel.$viewValue || '' );
                //element.find('input').val($filter('date')(ngModel.$viewValue, 'DD/MM/YYYY'));
            //}

            element.datetimepicker({ 
                language: 'pt-br',
                format: 'DD/MM/YYYY',
                pickTime: false
            });

            element.on('dp.change', function(){
                scope.$apply(read);
            });

            read();

            function read() {
                var value = element.find('input').val();
                ngModel.$setViewValue(value);
            }
        }
    }
});