'use strict';
app.controller('JogadorController', function($scope, loginService, $location, ngGesTeamSettings, $rootScope, statusService, $timeout, posicaoService, jogadorService) {
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
        btnLimparFiltroAvancado: $("#btnLimparFiltroAvancado"),
        modalAdicionarEditarJogador: {
            modal: $("#modalAdicionarEditarJogador"),
            rating: $("#modalAdicionarEditarJogador").find('.rating')
        }
    };

    me.filtrosAvancados = {
        posicao: undefined,
        pePreferido: undefined,
        status: undefined,
        palavraChave: undefined
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
        _carregarComboStatus();
        _carregarComboPosicao();
        _initMasks();
        _initValidation();
        me.carregarJogadores();
        setTimeout(function(){
            onresize(100);
        }, 1000);
    });

    var _initDataTable = function(){

        if (!$.fn.DataTable.isDataTable('.datatable')){

            $.fn.dataTable.ext.type.order['posicoes-pre'] = function ( d ) {
                switch ( d ) {
                    case 'Goleiro':    return 1;
                    case 'Fixo': return 2;
                    case 'Ala':   return 3;
                    case 'Pivô':   return 4;
                }
                return 0;
            };
        
            $(".datatable").dataTable({
                "destroy":   true,
                "paging":   true,
                "searching": false,
                "language": {
                    "url": "../js/plugins/datatables/Portuguese-Brasil.json"
                },
                initComplete: function () {
                    $('.dataTables_length').find('select').addClass('dataTables_selectpicker_length').selectpicker();
                    $(".datatable").on('page.dt',function () {
                        onresize(100);
                    });
                },
                columnDefs: [ 
                    { "type": "posicoes", targets: 0 },
                    { width: "120px", "className": "text-center", targets: 4 },
                    { width: "80px", "className": "text-center", targets: 5 },
                    { orderable: false, width: "80px", "className": "text-center", targets: [6, 7] }
                ]
            });
        
        }
        
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
            status: undefined,
            palavraChave: undefined
        };
    }

    //## Carregar lista de Jogadores
    me.carregarJogadores = function(){
        $rootScope.initLoading();
        me.lstJogadores = [];
        jogadorService.listar(
            me.usuario.timeSelecionado._id,
            me.filtrosAvancados.palavraChave, 
            me.filtrosAvancados.pePreferido,
            me.filtrosAvancados.status,
            me.filtrosAvancados.posicao).then(function(response){
                me.lstJogadores = response.data;
                $rootScope.completeLoading();
                setTimeout(function(){
                    _initDataTable();
                });
            },
            function(responseError){
                $rootScope.cancelLoading();
                $rootScope.openModalError("Não foi possível carregar os jogadores.");
            })
    }

    //## Click do botão Pesquisar
    me.pesquisar = function(){
        _tratarFiltrosNullOrEmpty();
        me.carregarJogadores();
    }

    var _tratarFiltrosNullOrEmpty = function(){
        if (!me.filtrosAvancados.palavraChave)
        me.filtrosAvancados.palavraChave = undefined;

        if (!me.filtrosAvancados.status)
            me.filtrosAvancados.status = undefined;

        if (!me.filtrosAvancados.pePreferido)
            me.filtrosAvancados.pePreferido = undefined;

        if (!me.filtrosAvancados.posicao)
            me.filtrosAvancados.posicao = undefined;
    }

    //## Evento de Exclusão de Jogador
    me.excluirJogador = function(_jogador){
        noty({
            text: 'Deseja realmente excluir?',
            layout: 'topRight',
            buttons: [
                    {addClass: 'btn btn-success btn-clean btn-small', text: 'Sim', onClick: function($noty) {
                        $noty.close();
                        $rootScope.initLoading();
                        jogadorService.excluir(_jogador._id).then(function(response){
                            if (response.data){
                                me.lstJogadores = $.grep(me.lstJogadores, function(x){
                                    return (x._id != _jogador._id);
                                });
                
                                noty({text: "Jogador excluído com sucesso!", layout: 'topRight', type: 'success'});
                                $rootScope.completeLoading();
                                setTimeout(function(){
                                    $.noty.closeAll();
                                }, 5000);          
                            }  
                        });
                    }
                    },
                    {addClass: 'btn btn-danger btn-clean btn-small', text: 'Não', onClick: function($noty) {
                        $noty.close();
                        }
                    }
                ]
        });
    }

    //## Evento de abertura do modal para Edição de Jogador
    me.modalEditarJogador = function(_jogador){
        me.jogador = $.extend({}, _jogador);
        me.jogador.acao = "Editar";
        me.jogador.dataNascimentoFormatada = moment($scope.jogador.dataNascimento).format('L');
        // me.formControls.modalAdicionarEditarJogador.rating.raty({ score: me.jogador.classificacao });
        me.formControls.modalAdicionarEditarJogador.rating.raty('score', me.jogador.classificacao);
        me.formControls.modalAdicionarEditarJogador.modal.modal('show');
    }

    //## Evento de Edição de Jogador
    me.editarJogador = function(){
        if (me.formControls.form.valid()){
            $rootScope.initLoading();
            
                        //## Faz as conversões necessárias
                        me.jogador.dataNascimento = moment(me.jogador.dataNascimentoFormatada, 'DD/MM/YYYY').toISOString();
                        //##
            
                        jogadorService.atualizar(me.jogador).then(function(responseAtualizar){
            
                            noty({text: "Jogador alterado com sucesso!", layout: 'topRight', type: 'success'});
                            
                            me.fecharModal(true);
                            
                            $rootScope.completeLoading();
                            setTimeout(function(){
                                $.noty.closeAll();
                            }, 5000);            
                        },
                        function(responseAtualizarError){
                            console.log(responseAtualizarError);
                            $rootScope.openModalError("Não foi possível alterar este jogador.");
                        });
        }
    }

    //## Evento de Inclusão de Jogador
    me.adicionarJogador = function(callback){
        if (me.formControls.form.valid()){
            $rootScope.initLoading();

            //## Faz as conversões necessárias
            me.jogador.dataNascimento = moment(me.jogador.dataNascimentoFormatada, 'DD/MM/YYYY').toISOString();
            //##

            me.jogador._time = me.usuario.timeSelecionado._id;
            me.jogador._status = $.grep(me.lstStatus, function(x){
               return (x.descricao == "Ativo");
            })[0]._id;
            
            jogadorService.cadastrar(me.jogador).then(function(responseCadastrar){

                noty({text: "Jogador adicionado com sucesso!", layout: 'topRight', type: 'success'});

                $rootScope.completeLoading();
                setTimeout(function(){
                    $.noty.closeAll();
                }, 5000);

                me.formControls.modalAdicionarEditarJogador.rating.raty('reload');
                
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

                me.carregarJogadores();

                if(callback){
                    callback();
                }

            },
            function(responseCadastrarError){
                console.log(responseCadastrarError);
                $rootScope.openModalError("Não foi possível cadastrar este jogador.");
            });
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
            me.carregarJogadores();
        }

        me.validator.resetForm();
        me.formControls.modalAdicionarEditarJogador.modal.find('.bootstrap-select.error').removeClass('error');
        me.formControls.modalAdicionarEditarJogador.modal.find('.valid').removeClass('valid');
        me.formControls.modalAdicionarEditarJogador.rating.raty('reload');

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

        $('#modalAdicionarEditarJogador').modal('hide');
    }

    

});