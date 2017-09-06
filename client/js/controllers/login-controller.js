'use strict';
app.controller('LoginController', ['$scope', '$location', '$rootScope', 'loginService', '$window', '$crypthmac', function($scope, $location, $rootScope, loginService, $window, $crypthmac) {
    var me = $scope;
    $scope.usuario = loginService.usuarioLogado();
    $scope.mensagem = '';
    $scope.formControls = {
        txtLogin: $("#txtLogin"),
        frmLogin: $("#frmLogin"),
        frmSelecionarTime: $("#frmSelecionarTime"),
        notificacao: $('#notificacao-erro')
    };

    // Load
    $scope.$on('$viewContentLoaded', function(){
       $scope.formControls.txtLogin.focus();
        $scope.formControls.notificacao.hide();
        $scope.formControls.frmSelecionarTime.hide();
        initValidation();

        var url = $location.url();
        if ($scope.usuario && url == '/login/selecionar-time'){
            $scope.formControls.frmLogin.hide();
            $scope.formControls.frmSelecionarTime.fadeIn(1000);
        }
        else if ($scope.usuario && $scope.usuario.timeSelecionado){
            $location.path('/principal');
        }

    });

    $scope.cadastro = function(){
        $location.path('/cadastro');
    };

    $scope.realizarLogin = function() {
        $scope.mensagem = '';
        $scope.formControls.notificacao.hide();
        var usuarioLogin = $scope.usuario;

        var isValid = $scope.formControls.frmLogin.valid();
        
        if (isValid){

            var authenticationData = {
                login: usuarioLogin.login,
                senha: $crypthmac.encrypt(usuarioLogin.senha)
            };

            loginService.logon(authenticationData).then(function(response){
                $scope.usuario = response;

                // Verifica se existe time cadastrado para o usuário
                if($scope.usuario.acessos.length == 0){
                    $scope.usuario = {};
                    $scope.mensagem = 'Não existem times cadastrados para este usuário.';
                    $scope.formControls.notificacao.show();
                    return;
                }
                
                // Exibe lista para seleção de time
                $scope.formControls.frmLogin.hide();
                $scope.formControls.frmSelecionarTime.fadeIn(1000);
            },
            function(responseError){
                $scope.usuario = {};
                
                if (responseError.status == 401){
                    $scope.mensagem = 'Usuário e/ou senha inválidos.';
                }
                else{
                    $scope.mensagem = 'Ocorreu um erro não esperado.';
                }
                $scope.formControls.notificacao.show();
            });
        }
    };

    $scope.selecionarTime = function(_idTime){
        $rootScope.initLoading();
        $scope.formControls.notificacao.hide();
        
        // Obter acesso ao time selecionado
        var acesso = JSON.parse(JSON.stringify($.grep($scope.usuario.acessos, function(x){
            return x._time._id == _idTime;
        })[0]));

        // Verificar status do time selecionado
        if (acesso._time.status == "Ativo"){
            loginService.selecionarTime(_idTime);
            loginService.preencherDadosAutenticacao();

            // Direciona o usuário para página principal do sistema
            $location.path('/principal');
        }
        else if (acesso._time.status == "Aguardando Liberação"){
            $scope.mensagem = 'O acesso a este time ainda não foi liberado.';
            $scope.formControls.notificacao.show();
        }
        else{
            $scope.mensagem = 'Não é possível completar o acesso.<br />Status do Time: ' + acesso._time.status;
            $scope.formControls.notificacao.show();
        }

        $rootScope.completeLoading();
    }

    $scope.cancelarSelecionarTime = function (){
        $scope.usuario = {};
        delete $window.sessionStorage.token
        $scope.formControls.frmSelecionarTime.hide();
        $scope.formControls.notificacao.hide();
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
}]); 