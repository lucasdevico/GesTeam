'use strict';
app.controller('JogadorController', function($scope, loginService, $location, ngGesTeamSettings, $rootScope, statusService, $timeout, posicaoService) {
	var me = $scope;

	// Obter o usuário logado
	me.usuario = loginService.usuarioLogado();

    me.formControls = {
        form: $("#frmJogador"),
        dvFiltrosAvancados: $("#dvFiltrosAvancados"),
        lblStatusModal: $("#lblStatusModal"),
        filtrosAvancados: {
            cboPosicao: $("#cboFiltrosPosicao"),
            cboPePreferido: $("#cboFiltrosPePreferido"),
            cboStatus: $("#cboFiltrosStatus")
        },
        jogador: {
            txtDtNascimento: $("#txtDtNascimento"),
            cboPosicao: $("#cboPosicao"),
            cboPePreferido: $("#cboPePreferido"),
            cboStatus: $("#cboStatus")
        },
        btnLimparFiltroAvancado: $("#btnLimparFiltroAvancado")
    };

    me.filtrosAvancados = {
        posicao: undefined,
        pePreferido: undefined,
        status: undefined
    };

    me.lstJogadores = [];
    me.lstPosicao = [];
    me.lstStatus = [];
	me.validator = {};
    me.tipoModal = "Adicionar";

    me.jogador = {
        apelido: null,
        nome: null,
        dataNascimento: null,
        dataNascimentoFormatada: null,
        posicao: null,
        pePreferido: null,
        classificacao: 1,
        status: null,
        contato: {
            email: null,
            telefone1: null,
            telefone2: null
        }
    };

	//## Verificar se o acesso ao conteúdo é permitido
	me.verificaAcesso = function(){
		if (!$scope.usuario){
			loginService.logout();
			$location.path('/redirecting');
		}
	}

	//## Load inicial da página
	me.$on('$viewContentLoaded', function(){
        _initDataTable();
        _carregarComboStatus();
        _carregarComboPosicao();
        _initMasks();
        _initValidation();
    });

    var _initDataTable = function(){
    	$(".datatable").dataTable({
    		"paging":   true,
        	"searching": false,
        	"language": {
            	"url": "../js/plugins/datatables/Portuguese-Brasil.json"
        	},
        	initComplete: function () {
        		$('.dataTables_length').find('select').addClass('dataTables_selectpicker_length').selectpicker();
        	},
            columnDefs: [ 
                { width: "120px", "className": "text-center", targets: 4 },
                { width: "80px", "className": "text-center", targets: 5 },
                { orderable: false, width: "80px", "className": "text-center", targets: [6, 7] }
            ]
    	});
        $(".datatable").on('page.dt',function () {
            onresize(100);
        });

        $('.select-rating').barrating({
            theme: 'fontawesome-stars'
        });
    };

    me.exibirFiltroAvancado = function(){
        me.formControls.dvFiltrosAvancados.slideToggle(null, function(){
            if (me.formControls.dvFiltrosAvancados.css('display') == 'none'){
                me.filtrosAvancados = {
                    posicao: undefined,
                    pePreferido: undefined,
                    status: undefined
                };
            }

            onresize(100);
        });
        me.formControls.btnLimparFiltroAvancado.fadeToggle();
    }

    //## Carregar lista de status
    var _carregarComboStatus = function(){
        me.lstStatus = [];
        statusService.listar("GENERICO").then(function(response){
            me.lstStatus = response.data;
            $timeout(function(){
                me.formControls.jogador.cboStatus.selectpicker('refresh');
                me.formControls.filtrosAvancados.cboStatus.selectpicker('refresh');
            });

        })
    }

    //## Carregar lista de posição
    var _carregarComboPosicao = function(){
        me.lstStatus = [];
        posicaoService.listar("FUTSAL").then(function(response){
            me.lstPosicao = response.data;
            $timeout(function(){
                me.formControls.jogador.cboPosicao.selectpicker('refresh');
                me.formControls.filtrosAvancados.cboPosicao.selectpicker('refresh');
            });

        })
    }

    var _initValidation = function(){
        if(me.formControls.form.length > 0){
            me.validator = me.formControls.form.validate({
                    rules: {
                        txtApelido: {
                            required: true
                        },
                        txtNome: {
                            required: true
                        },
                        txtDtNascimento: {
                            required: true,
                            date: true
                        },
                        txtEmail: {
                            email: true
                        },
                        cboPosicao: {
                          required: true  
                        },
                        cboPePreferido: {
                          required: true  
                        },
                        cboClassificacao: {
                          required: true  
                        }
                    }
                });
        }
    };

    //## Cria as mascaras dos campos
    var _initMasks = function(){
        $scope.formControls.jogador.txtDtNascimento.mask("99/99/9999");

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

    //## Limpar os filtros
    me.limparFiltroAvancado = function(){
        me.filtrosAvancados = {
            posicao: undefined,
            pePreferido: undefined,
            status: undefined
        };
    }

    //## Click do botão Pesquisar
    me.pesquisar = function(){
        console.log(me.filtrosAvancados);
    }

    //## Evento de Inclusão de Jogador
    me.adicionarJogador = function(callback){
        console.log(me.jogador);

        if (me.formControls.form.valid()){
            $rootScope.initLoading();

            //## Faz as conversões necessárias
            me.jogador.dataNascimento = moment(me.jogador.dataNascimentoFormatada, 'DD/MM/YYYY').toISOString();
            //##

            noty({text: "Jogador adicionado com sucesso!", layout: 'topRight', type: 'success'});
            $rootScope.completeLoading();
            setTimeout(function(){
                $.noty.closeAll();
            }, 5000);

            if(callback){
                callback();
            }
        }
    }

    //## Evento de Inclusão de Jogador e Fechar Modal
    me.adicionarJogadorUnico = function(){
        me.adicionarJogador(me.fecharModal);
    }
	
    //## Evento que fecha a janela modal de Jogador
    me.fecharModal = function(atualizarGrid){
        if (atualizarGrid){
            //## Atualizar informações do grid

        }
        $('#modalAdicionarEditarJogador').modal('hide');
    }

    

});