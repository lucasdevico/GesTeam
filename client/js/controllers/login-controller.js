'use strict';
angular.module('gesteam').controller('LoginController', function($scope, $http, $location, $rootScope, $window) {
    var me = $scope;
    $scope.usuario = {};
    $scope.mensagem = '';
    $scope.formControls = {
        txtLogin: $("#txtLogin"),
        frmLogin: $("#frmLogin"),
        frmSelecionarTime: $("#frmSelecionarTime"),
        notificacao: $('#notificacao-erro')
    };

    $scope.loadPage = function(){
        $scope.formControls.txtLogin.focus();
        $scope.formControls.notificacao.hide();
        $scope.formControls.frmSelecionarTime.hide();
        initValidation();
    };

    $scope.cadastro = function(){
        $location.path('/cadastro');
    };

    $scope.realizarLogin = function() {
        $scope.mensagem = '';
        $scope.formControls.notificacao.hide();
        var usuarioLogin = $scope.usuario;

        console.log($("#frmLogin").validator.validate());
        
        $http.post('/autenticar', {login: usuarioLogin.login, senha: usuarioLogin.senha})
        .then(function(response){
            $rootScope.usuario = $scope.usuario = response.data;

            console.log($scope.usuario);
            
            // Verifica se existe time cadastrado para o usuário
            if($scope.usuario.acessos.length == 0){
                $rootScope.usuario = $scope.usuario = {};
                $scope.mensagem = 'Não existem times cadastrados para este usuário.';
                $scope.formControls.notificacao.show();
                return;
            }
            
            // Exibe lista para seleção de time
            $scope.formControls.frmLogin.hide();
            $scope.formControls.frmSelecionarTime.fadeIn(1000);

            // Verifica status do time selecionado
            
            // Direciona o usuário para página principal do sistema
            //$location.path('/');
        }, function(erro) {
            $rootScope.usuario = $scope.usuario = {};
            $scope.mensagem = 'Usuário e/ou senha inválidos.';
            $scope.formControls.notificacao.show();
        });
    };

    $scope.cancelarSelecionarTime = function (){
        $rootScope.usuario = $scope.usuario = {};
        delete $window.sessionStorage.token
        $scope.formControls.frmSelecionarTime.hide();
        $scope.formControls.frmLogin.fadeIn(1000);
        $scope.formControls.txtLogin.focus();
    }

    var initValidation = function(){
        var validator = $("#frmLogin").validate({
                        rules: {
                            txtLogin: {
                                required: true
                            },
                            txtSenha: {
                                required: true
                            }
                        }
                    });
    }

    $scope.loadPage();
}); 