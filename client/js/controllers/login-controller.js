'use strict';
angular.module('gesteam').controller('LoginController', function($scope, $http, $location) {

    $scope.formControls = {
        notificacao: $('#notificacao-erro')
    };

    $scope.loadPage = function(){
        $scope.formControls.notificacao.addClass('hide');
    };

    $scope.usuario = {};
    $scope.mensagem = '';
    
    $scope.autenticar = function() {
        console.log('clicou');
        var usuario = $scope.usuario;
        $scope.formControls.notificacao.removeClass('hide');
        $scope.mensagem = 'Usuário e/ou senha inválidos.';  

        // $http.post('/autenticar', {login: usuario.login, senha: usuario.senha})
        // .then(function(){
        //     $location.path('/');
        // }, function(erro) {
        //     $scope.usuario = {};
        //     $scope.mensagem = 'Código do usuário ou senha incorreto(s)';
        // });
    };

    $scope.loadPage();
}); 