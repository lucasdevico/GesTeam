var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelTime = mongoose.model('Time');
	var modelContador = mongoose.model('Contador');

	api.verificarNomeTimeExistente = function(req, res){
		var nomeTime = req.params.nomeTime;
		
		let query = {};
		query.nome = {
				'$regex': '^' + nomeTime + '$',
				'$options': 'i'
		}

		//## Se parametro id foi informado, pesquisa apenas times diferentes do id informado
		req.params.id ? (query._id = { '$ne': req.params.id } ) : "";

		modelTime.find(query).then(
			function(lstTimes){
				if (lstTimes.length > 0){
					res.json(true);
				}
				else{
					res.json(false);
				}
	    	}, function(error){
				res.status(500).json(error);
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