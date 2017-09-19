'use strict';
app.controller('CadastroController', function(
        $scope, 
        $http, 
        $location, 
        $rootScope, 
        $window, 
        utilsService, 
        usuarioService, 
        $q, 
        ngGesTeamSettings,
        $crypthmac
){
	// controles da pagina
	$scope.formControls = {
        form: $("#frmNovoCadastro"),
        txtNome: $("#txtNome"),
        txtEmail: $("#txtEmail"),
        txtLogin: $("#txtLogin"),
        ttpLogin: $("#ttpLogin"),
        txtDtNascimento: $("#txtDtNascimento"),
        txtTelefone1: $("#txtTelefone1"),
        txtTelefone2: $("#txtTelefone2"),
        cboModalidade: $("#cboModalidade"),
        cboQtdQuadros: $("#cboQtdQuadros"),
        txtDtFundacao: $("#txtDtFundacao"),
        divInformacoesContatoTime: $("#divInformacoesContatoTime"),
        divInformacoesContatoPessoais: $("#divInformacoesContatoPessoais"),
        txtCEP: $("#txtCEP"),
        txtLogradouro: $("#txtLogradouro"),
        txtBairro: $("#txtBairro"),
        cboUF: $("#cboUF"),
        cboCidade: $("#cboCidade"),
        cbxUtilizarContatoPessoal: $("#cbxUtilizarContatoPessoal")
	};

    $scope.containerHeight = window.innerHeight;

	$scope.novoCadastro = {
		usuario: {
			nome: null,
			dataNascimento: null,
            login: null,
            senha: null,
            confirmaSenha: null,
            contato: {
                email: null,
                telefone1: null,
                telefone2: null,
                permiteSMS: false,
                permiteEmail: false
            }
		},
        time: {
            nome: null,
            nomeCompleto: null,
            dataFundacao: null,
            modalidade: undefined,
            qtdQuadros: undefined,
            localizacao: {
                cep: null,
                logradouro: null,
                numero: null,
                complemento: null,
                bairro: null,
                uf: undefined,
                cidade: undefined
            },
            contato: {
                email: null,
                telefone1: null,
                telefone2: null,
                permiteSMS: false,
            }
        }
	};

    $scope.lstEstados = [];
    $scope.lstCidades = [];
    $scope.validator = {};

	// load
	$scope.loadPage = function(){
		initSmartWizard();
        initMasks();
        initValidation();
        initPopover();
        $scope.createCustomErrors();
        $scope.carregarComboUF();
        $scope.formControls.txtNome.focus();

        //## DEBUG
        //$scope.novoCadastro = {"usuario":{"nome":"Lucas de Vico Souza","dataNascimento": null,"login":"lucas.devico","senha":"123456","confirmaSenha":"123456","contato":{"email":"lucas.devico@gmail.com","telefone1":"(11) 95169-4589","telefone2":null,"permiteSMS":true,"permiteEmail":true}},"time":{"nome":"Malibu","nomeCompleto":"Malibu Futsal","dataFundacao":"2007-03-28T03:00:00.000Z","modalidade":"Futsal","qtdQuadros":"2","localizacao":{"cep":"02072-001","logradouro":"Avenida Conceição","numero":"1310","complemento":"Apto. 4","bairro":"Carandiru","uf":"SP","cidade":"São Paulo"},"contato":{"email":"lucas.devico@gmail.com","telefone1":"(11) 95169-4589","telefone2":null,"permiteSMS":true,"permiteEmail":true},"status":"Aguardando Liberação","dataCadastro": null}};
	};

    var initPopover = function(){
        $("[data-toggle=popover]").popover({ html:true });
    }

    $scope.createCustomErrors = function(){
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

        // uniqueNomeTime -> Validar se o nome do time é unico
        $.validator.addMethod("uniqueNomeTime",
          function(value, element){
            $rootScope.initLoading();
            var isValid = false;
            var serviceBase = ngGesTeamSettings.apiServiceBaseUri;
            $.ajax({ url: serviceBase + '/time/verificarNomeTimeExistente/' + value, 
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
          "O Nome informado já está sendo utilizado."
        );

        // validaCep -> Validar se o email informado já está em uso
        $.validator.addMethod("validaCep",
          function(value, element){
            $rootScope.initLoading();
            var isValid = false;
            var serviceBase = ngGesTeamSettings.apiCorreiosBaseUri;
            // Se não existir _, então o cep está completamente preenchido
            if (value.indexOf("_") == -1){
                $.ajax({ url: serviceBase + value, 
                async: false, 
                success: 
                    function(response) { 
                        var dadosLocalizacao = response;

                        if(dadosLocalizacao){
                            $scope.novoCadastro.time.localizacao.logradouro = dadosLocalizacao.logradouro;
                            $scope.novoCadastro.time.localizacao.bairro = dadosLocalizacao.bairro;
                            $scope.novoCadastro.time.localizacao.uf = dadosLocalizacao.estado;
                            
                            $scope.formControls.cboUF.val(dadosLocalizacao.estado);
                            $scope.formControls.cboUF.selectpicker('refresh');
                            
                            $scope.lstCidades.push(dadosLocalizacao.cidade);
                            $scope.novoCadastro.time.localizacao.cidade = dadosLocalizacao.cidade;
                            $scope.formControls.cboCidade.val(dadosLocalizacao.cidade);
                            $scope.formControls.cboCidade.selectpicker('refresh');
                            isValid = true;
                        }
                        $rootScope.completeLoading();
                    },
                error:
                    function(responseError){
                        $scope.novoCadastro.time.localizacao = {
                            cep: null,
                            logradouro: null,
                            complemento: null,
                            bairro: null,
                            uf: null,
                            cidade: null,
                            numero: null
                        };

                        // Cep não encontardo
                        if (responseError.status == 404){
                            $rootScope.completeLoading();
                            isValid = false;
                        }
                        else if (responseError.status == 503){
                            var erro = "503 - Serviço indisponível.";
                            var detalhes = "Não foi possível obter as informações de endereço. Por favor, tente novamente mais tarde.";
                            $rootScope.openModalError(erro, detalhes);
                        }
                        else{
                            $rootScope.openModalError();
                        }
                    }
                });
            }
            else{
                    $rootScope.cancelLoading();
                    $scope.novoCadastro.time.localizacao = {
                        cep: null,
                        logradouro: null,
                        complemento: null,
                        bairro: null,
                        uf: null,
                        cidade: null,
                        numero: null
                    };
            }

            return isValid;
          },
          "CEP inválido ou não encontrado"
        );
    }

    var initValidation = function(){
        if($scope.formControls.form.length > 0){
            $scope.validator = $scope.formControls.form.validate({
                    rules: {
                        
                        //## Step 1
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

                        //## Step 2
                        txtTelefone1: {
                            required: true
                        },

                        //## Step 3
                        txtNomeTime: {
                            required: true,
                            uniqueNomeTime: true
                        },
                        txtNomeCompletoTime: {
                            required: true
                        },
                        txtDtFundacao: {
                            required: true,
                            date: true
                        },
                        cboModalidade: {
                            required: true
                        },
                        cboQtdQuadros: {
                            required: true
                        },
                        
                        //## Step 4
                        txtCEP: {
                            required: true,
                            validaCep: true
                        },
                        txtLogradouro: {
                            required: true
                        },
                        txtNumero: {
                            required: true
                        },
                        txtBairro: {
                            required: true
                        },
                        cboUF: {
                            required: true
                        },
                        cboCidade: {
                            required: true
                        },
                        txtTimeEmail: {
                            required: true,
                            email: true
                        },
                        txtTimeTelefone1: {
                            required: true
                        }
                    }
                });
        }
    };

    var initMasks = function(){
        $scope.formControls.txtCEP.mask('99999-999');
        $scope.formControls.txtDtNascimento.mask("99/99/9999");
        $scope.formControls.txtDtFundacao.mask("99/99/9999");

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

    // Start Smart Wizard
    var initSmartWizard = function(){
        
        if($(".wizard").length > 0){
            
            //Check count of steps in each wizard
            $(".wizard > ul").each(function(){
                $(this).addClass("steps_"+$(this).children("li").length);
            });//end
            
            setTimeout(function(){
               $(".wizard").smartWizard({        
                // fix para ajuste automático de altura após a validação
                //selected: 2,
                updateHeight: false,
                keyNavigation: false,
                onFinish: function(){
                    $scope.cadastrar();
                },
                // This part of code can be removed FROM
                onLeaveStep: function(obj, objTo){
                    var wizard = obj.parents(".wizard");

                    var currentStep = obj.attr('rel');
                    var nextStep = objTo.attr('rel');

                    if(wizard.hasClass("wizard-validation")){
                        
                        var valid = true;

                        // Se for "voltar" então não faz validações.
                        if (currentStep > nextStep){
                            return true;
                        }
                        
                        $('input,textarea',$(obj.attr("href"))).each(function(i,v){
                            valid = $scope.validator.element(v) && valid;
                        });
                                                    
                        if(!valid){
                            wizard.find(".stepContainer").removeAttr("style");
                            $scope.validator.focusInvalid();                                
                            return false;
                        }         
                        
                    }    
                    
                    return true;
                },// <-- TO
                
                //This is important part of wizard init
                onShowStep: function(obj){            
                    var wizard = obj.parents(".wizard");

                    if(wizard.hasClass("show-submit")){
                    
                        var step_num = obj.attr('rel');
                        var step_max = obj.parents(".anchor").find("li").length;

                        if(step_num == step_max){                             
                            obj.parents(".wizard").find(".actionBar .btn-primary").css("display","block");
                        }                         
                    }
                    return true;                         
                }//End
            });
            }, 0);
        }            
        
    }// End Smart Wizard

    $scope.fecharCadastro = function(){
        $location.path('/login');
    };

    $scope.configurarContatoTime = function($event){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'PESSOAL' : 'TIME');

        if (action == 'PESSOAL'){
            $scope.formControls.divInformacoesContatoTime.hide();
            $scope.formControls.divInformacoesContatoPessoais.fadeIn(1000);
        }
        else{
            $scope.formControls.divInformacoesContatoPessoais.hide();
            $scope.formControls.divInformacoesContatoTime.fadeIn(1000);
        }
    }

    $scope.carregarComboUF = function(){
        utilsService.listarEstados().then(function (response) {
                $scope.lstEstados = response.data;
            },
            function (responseError) {
                $rootScope.openModalError();
        });
    }

    $scope.carregarComboCidades = function(){
        $scope.novoCadastro.time.localizacao.cidade = null;
        $scope.lstCidades = [];
        var siglaEstado = $scope.novoCadastro.time.localizacao.uf;

        if (siglaEstado){
            utilsService.listarCidades(siglaEstado).then(function (response) {
                    if (response.data){
                        $scope.lstCidades = response.data[0].cidades;
                    }
                },
                function (responseError) {
                    $rootScope.openModalError();
            });
        }
    }

    $scope.cadastrar = function(){
        if ($scope.formControls.form.valid()){

            // Define os valores inicias
            $scope.novoCadastro.time.status = 'Aguardando Liberação';
            $scope.novoCadastro.time.dataCadastro = new Date();

            if ($scope.formControls.cbxUtilizarContatoPessoal.prop("checked")){
                $scope.novoCadastro.time.contato = $scope.novoCadastro.usuario.contato;
            }

            $scope.novoCadastro.usuario.senha = $crypthmac.encrypt($scope.novoCadastro.usuario.senha);

            usuarioService.cadastrar($scope.novoCadastro).then(function (response) {
                        var msg = "Seu cadastro foi efetuado com sucesso.";
                        var msgDetalhes = "Nossa equipe irá analisar as informações e em breve você receberá um email com a liberação do acesso ao sistema.";
                        var fnCallback =  function(){
                            $location.path('/login'); 
                            $scope.$apply();
                        };

                        $rootScope.openModalSuccess(msg, msgDetalhes, fnCallback);
                    },
                    function (responseError) {
                        console.log(responseError);
                        $rootScope.openModalError();
            });
        }
    }

	// init
	$scope.loadPage();
});