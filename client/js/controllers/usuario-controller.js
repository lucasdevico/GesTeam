'use strict';
app.controller('UsuarioController', function($scope, loginService, $location, ngGesTeamSettings, $rootScope, utilsService, $q, $timeout, usuarioService) {
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
        txtSenha: $("#txtSenha"),
        txtConfirmaSenha: $("#txtConfirmaSenha"),
        txtTelefone1: $("#txtTelefone1"),
        txtTelefone2: $("#txtTelefone2"),
        cbxPermiteSMS: $("#cbxPermiteSMS"),
        cbxPermiteEmail: $("#cbxPermiteEmail"),
        dvAlterarSenha: $("#dvAlterarSenha")
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
            $.ajax({ url: serviceBase + '/usuario/verificarLoginExistente/' + value, 
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
            $.ajax({ url: serviceBase + '/usuario/verificarEmailExistente/' + value, 
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
                        txtSenha: {
                            required: true,
                            minlength: 6,
                            maxlength: 12,
                        },
                        txtConfirmaSenha: {
                            required: true,
                            minlength: 6,
                            maxlength: 12,
                            equalTo: "#txtSenha"
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
        $scope.formControls.dvAlterarSenha.show();
    }

    $scope.desabilitarAlterarSenha = function(){
        $scope.formControls.dvAlterarSenha.hide();
    }

    $scope.salvar = function(){
        $rootScope.initLoading();
        if ($scope.formControls.form.valid()){

            //## Fazer upload do simbolo para a pasta origem
            $scope.uploadSimbolo().then(function(responseUpload){                
                //## Existe retorno?
                if (responseUpload){
                    //## Foi efetuado o upload?
                    if (responseUpload.data.nome_arquivo){
                        //## Atualiza o nome do arquivo para o nome gerado pelo sistema
                        //## no objeto do escopo
                        $scope.time.imagemSimbolo = "../img/simbolos/" + responseUpload.data.nome_arquivo;
                    }
                }

                //## Faz as conversões necessárias
                $scope.time.dataFundacao = moment($scope.time.dataFundacaoFormatada, 'DD/MM/YYYY').toISOString();
                $scope.timeNormalizado = $.extend({}, $scope.time);
                $scope.timeNormalizado.coresUniforme1 = $scope.time.coresUniforme1.getText();
                $scope.timeNormalizado.coresUniforme2 = $scope.time.coresUniforme2.getText();
                //##

                //## Atualizar as informações na base
                timeService.atualizar($scope.timeNormalizado).then(function(responseAtualizar){
                    if (responseAtualizar.data && responseAtualizar.data === true){
                        
                        //## Atualizar as informações do time selecionado em cache
                        loginService.preencherDadosAutenticacao();
                        $scope.usuario = loginService.usuarioLogado();

                        //## Rola o Scroll pra cima
                        $('body').animate({scrollTop: 0}, 250);

                        $rootScope.openModalSuccess("O cadastro do time foi atualizado.");
                    }
                    else{
                        $rootScope.openModalError("Não foi possível atualizar o cadastro deste time.");   
                    }
                },
                function(responseAtualizarError){
                    $rootScope.openModalError("Não foi possível atualizar o cadastro deste time.");
                });
            });
        }

    };

	//## Gatilhos iniciais
	$scope.verificaAcesso();
});