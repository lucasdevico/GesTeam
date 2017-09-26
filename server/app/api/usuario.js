var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelUsuario = mongoose.model('Usuario');
	var modelTime = mongoose.model('Time');
	var modelContador = mongoose.model('Contador');

	api.obter = function(req, res){
		var idUsuario = req.params.id;
		modelUsuario.findOne({_id: idUsuario}).then(function(usuario){
			res.json(usuario);
		}, function(error){
			res.status(500).json(error);
		})
	};

	api.atualizar = function(req, res){
		var usuario = req.body;
		var idUsuario = req.params.id;

		modelUsuario.update({_id: idUsuario}, usuario).then(function(time){
			res.json(true);
		}, function(error){
			res.status(500).json(error);
		})
	};

	api.verificarEmailExistente = function(req, res){
		var email = req.params.email;

		let query = { contato: {} };
		query.contato.email = {
				'$regex': '^' + email + '$',
				'$options': 'i'
		}

		//## Se parametro id foi informado, pesquisa apenas usuarios diferentes do id informado
		req.params.id ? (query._id = { '$ne': req.params.id } ) : "";

		modelUsuario.find(query).then(
			function(lstUsuarios){
				if (lstUsuarios.length > 0){
					res.json(true);
				}
				else{
					res.json(false);
				}
	    	}, function(error){
				res.status(500).json(error);
		});
	};

	api.verificarLoginExistente = function(req, res){
		var login = req.params.login;

		let query = { };
		query.login = {
				'$regex': '^' + login + '$',
				'$options': 'i'
		}

		//## Se parametro id foi informado, pesquisa apenas usuarios diferentes do id informado
		req.params.id ? (query._id = { '$ne': req.params.id } ) : "";

		modelUsuario.find(query).then(
			function(lstUsuarios){
				if (lstUsuarios.length > 0){
					res.json(true);
				}
				else{
					res.json(false);
				}
		    }, function(error){
				res.status(500).json(error);
	    });
	};

	api.cadastrarUsuario = function(req, res){
		var novoCadastro = req.body;

		gerarCodigoIdentificacao(function(codigoIdentificacao){

			// Atribui o código de identificação gerado pela base
			novoCadastro.time.codigoIdentificacao = codigoIdentificacao;

			modelTime.create(novoCadastro.time).then(
			function(time){
				var usuario = {};
				novoCadastro.time = time;

				usuario = novoCadastro.usuario;
				usuario.acessos = [{
					_time: time._id
				}];

				modelUsuario.create(usuario).then(
					function(_usuario){
						usuario = _usuario;
						res.json(usuario);
				}, function(error){
					res.status(500).json(error);
				});

		}, function(error){
			res.status(500).json(error);
		});
		});
	};

	var gerarCodigoIdentificacao = function(callback){
		modelContador.findAndModify({ _id: 'codigoIdentificacaoTime' }, [], { $inc: { sequence_value: 1 } }, {}, 
			function (err, contador) {
		  		if (err) throw err;
		  		callback(contador.value.sequence_value + 1)
		});
	}

	return api;
}