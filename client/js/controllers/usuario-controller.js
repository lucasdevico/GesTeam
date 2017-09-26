'use strict';
app.controller('UsuarioController', function($scope, loginService, $location, ngGesTeamSettings, $rootScope, utilsService, $q, $timeout, usuarioService, $crypthmac) {
	var me = $scope;

	// Obter o usuário logado
	$scope.usuario = loginService.usuarioLogado();

	//## controles da página
	$scope.formControls = {
        form: $("#frmTime"),
        txtNome: $("#txtNome"),
        txtDtNascimento: $("#txtDtNascimento"),
        txtEmail: $("#txtEmail"),
        txtLogin: $("#txtLogin"),
        txtSenhaAtual: $("#txtSenhaAtual"),
        txtSenhaNova: $("#txtSenhaNova"),
        txtConfirmaSenha: $("#txtConfirmaSenha"),
        txtTelefone1: $("#txtTelefone1"),
        txtTelefone2: $("#txtTelefone2"),
        cbxPermiteSMS: $("#cbxPermiteSMS"),
        cbxPermiteEmail: $("#cbxPermiteEmail"),
        dvAlterarSenha: $("#dvAlterarSenha"),
        dvLinkAlterarSenha: $("#dvLinkAlterarSenha")
	};

    $scope.validator = {};

    //## Verificar se o acesso ao conteúdo é permitido
	$scope.verificaAcesso = function(){
		if (!$scope.usuario){
			loginService.logout();
			$location.path('/redirecting');
		}
	}

	//## Load inicial da página
	$scope.$on('$viewContentLoaded', function(){        
        $rootScope.initLoading();

        //## Carregar as informações do usuário
        usuarioService.obter($scope.usuario._id).then(function(response){

            //## Cria uma cópia do usuário para utilizar na página
            //## Este objeto será manipulado e posteriormente salvo.
            $scope.usuarioEdicao = response.data;
            $scope.usuarioEdicao.dataNascimentoFormatada = moment($scope.usuarioEdicao.dataNascimento).format('L');
            $scope.usuarioEdicao.senha = '';

            //## DEBUG - REMOVER
            console.log($scope.usuarioEdicao);
            //##

            _initPopover();
            _initMasks();
            _createCustomErrors();
            _initValidation();
            
            $rootScope.completeLoading();
        });
        //##
	});

    //## Criação de erros customizados
    //## 		1. Validação de nome de time único
    //## 		2. Validação de CEP válido e busca de endereço
	var _createCustomErrors = function(){
        // uniqueLogin -> Validar se o login informado já está em uso
        $.validator.addMethod("uniqueLogin",
          function(value, element){
            $rootScope.initLoading();
            var isValid = false;
            var serviceBase = ngGesTeamSettings.apiServiceBaseUri;
            var idUsuario = $scope.usuario._id;
            $.ajax({ url: serviceBase + '/usuario/verificarLoginExistente/' + value  + '/' + idUsuario, 
                async: false, 
                success: 
                    function(msg) { 
                        isValid = !msg;
                        $rootScope.completeLoading();
                    },
                error:
                    function(err){
                        $rootScope.cancelLoading();
                        $rootScope.openModalError();
                    }
            });
            return isValid;
          },
          "O login informado já está sendo utilizado."
        );

        // patternLogin -> Validar se o login possui os caracteres permitidos
        $.validator.addMethod("patternLogin",
          function(value, element){
            $rootScope.initLoading();
            var isValid = false;
            var regex = ngGesTeamSettings.regexLogin;
            isValid = value.match(regex);
            $rootScope.completeLoading();
            return isValid;
          },
          "O login informado não é valido."
        );

        // uniqueEmail -> Validar se o email informado já está em uso
        $.validator.addMethod("uniqueEmail",
          function(value, element){
            $rootScope.initLoading();
            var isValid = false;
            var serviceBase = ngGesTeamSettings.apiServiceBaseUri;
            var idUsuario = $scope.usuario._id;
            $.ajax({ url: serviceBase + '/usuario/verificarEmailExistente/' + value + '/' + idUsuario, 
                async: false, 
                success: 
                    function(response) { 
                        isValid = !response;
                        $rootScope.completeLoading();
                    },
                error:
                    function(err){
                        $rootScope.cancelLoading();
                        $rootScope.openModalError();
                    }
            });
            return isValid;
          },
          "O email informado já existe em nosso sistema"
        );
		
	};

	//## Criação das validações da página
	var _initValidation = function(){
        	if($scope.formControls.form.length > 0){
            	$scope.validator = $scope.formControls.form.validate({
            		rules: {
                        txtNome: {
                            required: true
                        },
                        txtDtNascimento: {
                            required: true,
                            date: true
                        },
                        txtEmail: {
                            required: true,
                            email: true,
                            uniqueEmail: true
                        },
                        txtLogin: {
                            required: true,
                            minlength: 6,
                            maxlength: 24,
                            patternLogin: true,
                            uniqueLogin: true
                        },
                        txtSenhaAtual: {
                            required: true,
                            minlength: 6,
                            maxlength: 12,
                        },
                        txtSenhaNova: {
                            required: true,
                            minlength: 6,
                            maxlength: 12,
                        },
                        txtConfirmaSenha: {
                            required: true,
                            minlength: 6,
                            maxlength: 12,
                            equalTo: "#txtSenhaNova"
                        },
                        txtTelefone1: {
                            required: true
                        }
                    }
                });
        }
    };

    //## Criação de máscaras para os campos
	var _initMasks = function(){
        $scope.formControls.txtDtNascimento.mask("99/99/9999");

        $(".mask-telefone").mask("(99) 9999-9999?9")
            .focusout(function (event) {  
                var target, phone, element;  
                target = (event.currentTarget) ? event.currentTarget : event.srcElement;  
                phone = target.value.replace(/\D/g, '');
                element = $(target);  
                element.unmask();  
                if(phone.length > 10) {  
                    element.mask("(99) 99999-999?9");  
                } else {  
                    element.mask("(99) 9999-9999?9");  
                }  
            });
    }

	//## Criação dos popups da página
	var _initPopover = function(){
        $("[data-toggle=popover]").popover({ html:true });
    }

    $scope.habilitarAlterarSenha = function(){
        $scope.formControls.dvLinkAlterarSenha.hide();
        $scope.formControls.dvAlterarSenha.fadeIn();
    }

    $scope.desabilitarAlterarSenha = function(){
        $scope.usuarioEdicao.senhaAtual = "";
        $scope.usuarioEdicao.novaSenha = "";
        $scope.usuarioEdicao.confirmaSenha = "";
        $scope.validator.resetForm();
        $scope.formControls.dvAlterarSenha.fadeOut(200, function(){
            $scope.formControls.dvLinkAlterarSenha.show();
        });
    }

    $scope.salvar = function(){
        $rootScope.initLoading();
        if ($scope.formControls.form.valid()){

            //## Faz as conversões necessárias
            $scope.usuarioEdicao.dataNascimento = moment($scope.usuarioEdicao.dataNascimentoFormatada, 'DD/MM/YYYY').toISOString();
            //##

            //# Verifica se o usuário está alterando a senha
            if ($scope.usuarioEdicao.novaSenha){
                //## Valida se a senha atual está correta
                var senhaAtualCrypto = $crypthmac.encrypt($scope.usuarioEdicao.senhaAtual);
                if ($scope.usuario.senha == senhaAtualCrypto){
                    var senhaNovaCrypto = $crypthmac.encrypt($scope.usuarioEdicao.novaSenha);

                    //## Valida se a nova senha é diferente da senha atual
                    if (senhaAtualCrypto == senhaNovaCrypto){
                        $scope.usuarioEdicao.senha = $scope.usuario.senha;
                        $scope.usuarioEdicao.senhaAtual = "";
                        $rootScope.openModalError("Não foi possível atualizar o cadastro deste usuário.", "A Nova Senha deve ser diferente da Senha Atual.");
                        return;    
                    }
                    //##

                    //## Atualiza a senha criptografada no objeto
                    $scope.usuarioEdicao.senha = senhaNovaCrypto;
                }
                else{
                    $scope.usuarioEdicao.senha = $scope.usuario.senha;
                    $scope.usuarioEdicao.senhaAtual = "";
                    $rootScope.openModalError("Não foi possível atualizar o cadastro deste usuário.", "A Senha atual informada não é válida.");
                    return;
                }
                //##
            }
            else{
                $scope.usuarioEdicao.senha = $scope.usuario.senha;
            }
            //##

            //## Atualizar as informações na base
            usuarioService.atualizar($scope.usuarioEdicao).then(function(responseAtualizar){
                if (responseAtualizar.data && responseAtualizar.data === true){
                    
                    //## Atualizar as informações do usuario em cache
                    loginService.preencherDadosAutenticacao();
                    $scope.usuario = loginService.usuarioLogado();

                    //## Rola o Scroll pra cima
                    $('body').animate({scrollTop: 0}, 250);

                    //## Desabilita mudança de senha
                    $scope.formControls.dvLinkAlterarSenha.show();
                    $scope.formControls.dvAlterarSenha.hide();
                    $scope.usuarioEdicao.senhaAtual = "";
                    $scope.usuarioEdicao.novaSenha = "";
                    $scope.usuarioEdicao.confirmaSenha = "";

                    $rootScope.openModalSuccess("O cadastro do usuário foi atualizado.");
                }
                else{
                    $rootScope.openModalError("Não foi possível atualizar o cadastro deste usuário.");   
                }
            },
            function(responseAtualizarError){
                $rootScope.openModalError("Não foi possível atualizar o cadastro deste usuário.");
            });
        }

    };

	//## Gatilhos iniciais
	$scope.verificaAcesso();
});