var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelJogador = mongoose.model('Jogador');

	var tratarParamUndefined = function(value){
		if (value == 'undefined' || value == 'null'){
			value = undefined;
		}
		return value;
	}

	api.listar = function(req, res){
		let query = {}; 

		query._time = req.params.idTime;
		
		tratarParamUndefined(req.params.palavraChave) ? (query.nome = {
				'$regex': '^' + req.params.palavraChave + '$',
				'$options': 'i'
		}) : "";

		tratarParamUndefined(req.params.palavraChave) ? (query.apelido = {
				'$regex': '^' + req.params.palavraChave + '$',
				'$options': 'i'
		}) : "";

		tratarParamUndefined(req.params.pePreferido) ? (query.pePreferido = req.params.pePreferido) : "";
		tratarParamUndefined(req.params.status) ? (query._status = req.params.status) : "";

		tratarParamUndefined(req.params.posicao) ? (query.posicao = req.params.posicao) : "";

		console.log(query);

		modelJogador.find(query)
		.populate('_status')
		//.populate('_time')
		.then(function(jogadores){
			res.json(jogadores);
		}, function(error){
			res.status(500).json(error);
		});
	};

	api.obter = function(req, res){
		var idJogador = req.params.idJogador;

		if(!idJogador){
			return res.status(500).json("ID do Jogador não informado!");
		}

		modelJogador.findOne({_id: idJogador}).then(function(jogador){
			res.json(jogador);
		}, function(error){
			res.status(500).json(error);
		});
	};

	api.atualizar = function(req, res){
		var jogador = req.body;
		var idJogador = req.params.id;
		modelJogador.update({_id: idJogador}, jogador).then(function(jogador){
			res.json(true);
		}, function(error){
			res.status(500).json(error);
		})
	};

	api.inserir = function(req, res){
		var novoJogador = req.body;

		modelJogador.create(novoJogador).then(function(jogador){
				res.json(jogador);
			}, function(error){ 
				res.status(500).json(error);
		});
	};

	api.excluir = function(req, res){
		var idJogador = req.params.id;

		modelJogador.remove({_id: idJogador}).then(function(jogador){
				res.json(true);
			}, function(error){ 
				res.status(500).json(error);
		});
	};

	return api;
}