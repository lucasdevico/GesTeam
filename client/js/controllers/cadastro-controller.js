'use strict';
app.controller('CadastroController', function($scope, $http, $location, $rootScope, $window, utilsService) {
	// controles da pagina
	$scope.formControls = {
        form: $("#frmNovoCadastro"),
        txtNome: $("#txtNome"),
        txtDtNascimento: $("#txtDtNascimento"),
        txtTelefone1: $("#txtTelefone1"),
        txtTelefone2: $("#txtTelefone2"),
        txtDtFundacao: $("#txtDtFundacao"),
        divInformacoesContatoTime: $("#divInformacoesContatoTime"),
        divInformacoesContatoPessoais: $("#divInformacoesContatoPessoais"),
        cboUF: $("#cboUF"),
        cboCidade: $("#cboCidade")
	};

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
            },
            localizacao: {
                cep: null,
                logradouro: null,
                complemento: null,
                bairro: null,
                uf: null,
                cidade: null
            }
		},
        time: {
            localizacao: {
                uf: null,
                cidade: null
            }
        }
	};

    $scope.lstEstados = [];
    $scope.lstCidades = [];

	// load
	$scope.loadPage = function(){
		initSmartWizard();
		initDatepicker();
        initMasks();
        $scope.carregarComboUF();
        $scope.formControls.txtNome.focus();
	};

	$scope.fecharCadastro = function(){
        $location.path('/login');
    };

    var initDatepicker = function(){    
        $(".datepicker").datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'pt-br',
            useCurrent: false
        });
    }

    var initMasks = function(){
        $scope.formControls.txtDtNascimento.mask("99/99/9999");
        $scope.formControls.txtDtFundacao.mask("99/99/9999");

        $scope.formControls.txtTelefone1.mask("(99) 9999-9999?9")
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

        $scope.formControls.txtTelefone2.mask("(99) 9999-9999?9")
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
            
            // This par of code used for example
            if($scope.formControls.form.length > 0){
                var validator = $scope.formControls.form.validate({
                        rules: {
                            /*
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
                                email: true
                            },
                            txtLogin: {
                                required: true
                            },
                            txtSenha: {
                                required: true,
                                minlength: 6,
                                maxlength: 10,
                            },
                            txtConfirmaSenha: {
                                required: true,
                                minlength: 6,
                                maxlength: 10,
                                equalTo: "#txtSenha"
                            },

                            //## Step 2
                            txtTelefone1: {
                                required: true
                            },

                            //## Step 3
                            txtNomeTime: {
                                required: true
                            },
                            txtNomeCompletoTime: {
                                required: true
                            },
                            cboModalidade: {
                                required: true
                            },
                            cboQtdQuadros: {
                                required: true
                            },

                            //## Step 4
                            txtCEP: {
                                required: true
                            },
                            txtLogradouro: {
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
                            */
                        }
                    });
            }
            
            setTimeout(function(){
               $(".wizard").smartWizard({        
                // fix para ajuste automático de altura após a validação
                updateHeight: false,
                // This part of code can be removed FROM
                onLeaveStep: function(obj){
                    var wizard = obj.parents(".wizard");

                    if(wizard.hasClass("wizard-validation")){
                        
                        var valid = true;
                        
                        $('input,textarea',$(obj.attr("href"))).each(function(i,v){
                            valid = validator.element(v) && valid;
                        });
                                                    
                        if(!valid){
                            wizard.find(".stepContainer").removeAttr("style");
                            validator.focusInvalid();                                
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
                console.log('erro!');
                //## TRATAR
            });
    }

    $scope.carregarComboCidades = function(){
        var siglaEstado = $scope.novoCadastro.time.localizacao.uf;
        utilsService.listarCidades(siglaEstado).then(function (response) {
                $scope.lstCidades = response.data;
            },
            function (responseError) {
                console.log('erro!');
                //## TRATAR
            });
    }

	// init
	$scope.loadPage();
});