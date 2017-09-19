'use strict';
app.controller('TimeController', function($scope, loginService, $location, ngGesTeamSettings, $rootScope, utilsService, $q, $timeout) {
	var me = $scope;

	// Obter o usuário logado
	$scope.usuario = loginService.usuarioLogado();

	//## Cria uma cópia do time para utilizar na página
	//## Este objeto será manipulado e posteriormente salvo.
	$scope.time = $.extend({}, $scope.usuario.timeSelecionado);
	$scope.time.dataFundacao = moment($scope.time.dataFundacao).format('DD/MM/YYYY');

	//## DEBUG - REMOVER
	console.log($scope.time);
	//##
	
	//## controles da página
	$scope.formControls = {
        form: $("#frmTime"),
        txtNomeTime: $("#txtNomeTime"),
        txtNomeCompletoTime: $("#txtNomeCompletoTime"),
        txtDtFundacao: $("#txtDtFundacao"),
        cboModalidade: $("#cboModalidade"),
        cboQtdQuadros: $("#cboQtdQuadros"),
        divInformacoesContatoTime: $("#divInformacoesContatoTime"),
        txtCEP: $("#txtCEP"),
        txtLogradouro: $("#txtLogradouro"),
        txtComplemento: $("#txtComplemento"),
        txtBairro: $("#txtBairro"),
        cboUF: $("#cboUF"),
        cboCidade: $("#cboCidade"),
        txtTimeEmail: $("#txtTimeEmail"),
        txtTimeTelefone1: $("#txtTelefone1"),
        txtTimeTelefone2: $("#txtTelefone2"),
        cbxTimePermiteSMS: $("#cbxTimePermiteSMS"),
        cbxTimePermiteEmail: $("#cbxTimePermiteEmail")
	};

	$scope.lstEstados = [];
    $scope.lstCidades = [];
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
		_initCoresUniformes();
		_initFileInput();
		_initPopover();
		_initMasks();
		_createCustomErrors();
		_initValidation();
		_carregarComboUF().then(function(){
            $scope.carregarComboCidades();
            $timeout(function(){
                $scope.formControls.cboUF.val($scope.time.localizacao.uf);
                $scope.formControls.cboUF.selectpicker('refresh');
            });
        });
	});

	//## Carregar combo UF
	var _carregarComboUF = function(){
        var deferred = $q.defer();
        $scope.lstEstados = [];
        utilsService.listarEstados().then(function (response) {
                $scope.lstEstados = response.data;
                deferred.resolve();
            },
            function (responseError) {
                $rootScope.openModalError();
                deferred.reject();
        });

        return deferred.promise;
    };

    //## Carregar Combo Cidades
    $scope.carregarComboCidades = function(){
        $scope.lstCidades = [];
        var siglaEstado = $scope.time.localizacao.uf;

        if (siglaEstado){
            utilsService.listarCidades(siglaEstado).then(function (response) {
                    if (response.data){
                        $scope.lstCidades = response.data[0].cidades;
                        $timeout(function(){
                            $scope.formControls.cboCidade.val($scope.time.localizacao.cidade);
                            $scope.formControls.cboCidade.selectpicker('refresh');
                        });
                    }
                },
                function (responseError) {
                    $rootScope.openModalError();
            });
        }
    }

    //## Criação de erros customizados
    //## 		1. Validação de nome de time único
    //## 		2. Validação de CEP válido e busca de endereço
	var _createCustomErrors = function(){
		//## uniqueNomeTime -> Validar se o nome do time é unico
        $.validator.addMethod("uniqueNomeTime",
          function(value, element){
            $rootScope.initLoading();
            var isValid = false;
            var serviceBase = ngGesTeamSettings.apiServiceBaseUri;
            var idTime = $scope.time._id;
            $.ajax({ url: serviceBase + '/time/verificarNomeTimeExistente/' + value + '/' + idTime, 
            //$.ajax({ url: serviceBase + '/time/verificarNomeTimeExistente/' + value, 
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

        //## validaCep -> Validar se o email informado já está em uso
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
                            $scope.time.localizacao.logradouro = dadosLocalizacao.logradouro;
                            $scope.time.localizacao.bairro = dadosLocalizacao.bairro;
                            $scope.time.localizacao.uf = dadosLocalizacao.estado;
                            
                            $scope.formControls.cboUF.val(dadosLocalizacao.estado);
                            $scope.formControls.cboUF.selectpicker('refresh');
                            
                            $scope.lstCidades.push(dadosLocalizacao.cidade);
                            $scope.time.localizacao.cidade = dadosLocalizacao.cidade;
                            $scope.formControls.cboCidade.val(dadosLocalizacao.cidade);
                            $scope.formControls.cboCidade.selectpicker('refresh');
                            isValid = true;
                        }
                        $rootScope.completeLoading();
                    },
                error:
                    function(responseError){
                        $scope.time.localizacao = {
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
                    $scope.time.localizacao = {
                        cep: null,
                        logradouro: null,
                        complemento: null,
                        bairro: null,
                        uf: null,
                        cidade: null,
                        numero: null
                    };
            }

            if (!isValid){
                element.focus();
            }

            return isValid;
          },
          "CEP inválido ou não encontrado"
        );
	};

	//## Criação das validações da página
	var _initValidation = function(){
        	if($scope.formControls.form.length > 0){
            	$scope.validator = $scope.formControls.form.validate({
            		rules: {
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

    //## Criação de máscaras para os campos
	var _initMasks = function(){
        $scope.formControls.txtCEP.mask('99999-999');
        $scope.formControls.txtDtFundacao.mask("99/99/9999");//.datepicker();

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

    //## Manipulação das cores dos uniformes para manipulação dos controles da página
	var _initCoresUniformes = function(){
		var coresUniforme1 = $scope.time.coresUniforme1;
		var coresUniforme2 = $scope.time.coresUniforme2;
		
		$scope.time.coresUniforme1 = {
			camisa: coresUniforme1.split(';')[0],
			calcao: coresUniforme1.split(';')[1],
			meiao: coresUniforme1.split(';')[2],
			getText: function(){
				var cores = this.camisa + ";" + this.calcao + ";" + this.meiao;
				return cores;
			}
		};

		$scope.time.coresUniforme2 = {
			camisa: coresUniforme2.split(';')[0],
			calcao: coresUniforme2.split(';')[1],
			meiao: coresUniforme2.split(';')[2],
			getText: function(){
				var cores = this.camisa + ";" + this.calcao + ";" + this.meiao;
				return cores;
			}
		};
	}

	//## Criação dos popups da página
	var _initPopover = function(){
        $("[data-toggle=popover]").popover({ html:true });
    }

    //## Criação dos files upload da página
    //##		1. Upload do símbolo
	var _initFileInput = function(){
		$("#fldSimbolo").fileinput({
            overwriteInitial: true,
            maxFileCount: 1,
            maxFileSize: 1500,
            showClose: false,
            showCaption: false,
            browseLabel: '',
            removeLabel: '',
            browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
            removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
            removeTitle: 'Cancelar alteração',
            //elErrorContainer: '#kv-simbolo-errors-1',
            //msgErrorClass: 'alert alert-block alert-danger',
            //defaultPreviewContent: '<img src="../img/simbolos/semsimbolo.png" alt="Símbolo">',
            defaultPreviewContent: '<img src="' + $scope.time.imagemSimbolo + '" alt="Símbolo">',
            layoutTemplates: {
            	main2: '<div class="kv-simbolo-custom"><div class="file-preview-status text-center text-success"></div><div class="kv-simbolo-custom-preview">{preview}</div><div class="kv-simbolo-custom-controls">{remove} {browse}</div></div>',
            	footer: '',
            	preview: '<div class="file-preview {class}">\n' +
                '    {close}' +
                '    <div class="{dropClass}">\n' +
                '    <div class="file-preview-thumbnails">\n' +
                '    </div>\n' +
                '    <div class="clearfix"></div>' +
                //'    <div class="file-preview-status text-center text-success"></div>\n' +
                //'    <div class="kv-fileinput-error"></div>\n' +
                '    </div>\n' +
                '</div>'
            },
            allowedFileTypes: ['image'],
            allowedFileExtensions: ["jpg", "png", "gif"],
            fileActionSettings: {
            	showZoom: false
            },
            resizeImage: true            
        });
	};

    $scope.salvar = function(){
        if ($scope.formControls.form.valid()){

            //## Fazer upload do simbolo para a pasta origem
            if (fldSimbolo.files.length > 0){
                utilsService.uploadSimbolo($scope.time.arquivoSimbolo);
            }
        
            //## Atualizar as informações na base

            //## Atualizar as informações no usuario logado
        }
    };

	//## Gatilhos iniciais
	$scope.verificaAcesso();
});