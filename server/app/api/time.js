var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelTime = mongoose.model('Time');
	var modelContador = mongoose.model('Contador');

	api.verificarNomeTimeExistente = function(req, res){
		var nomeTime = req.params.nomeTime;

		modelTime.find({"nome": { '$regex': '^' + nomeTime + '$', '$options' : 'i' } }).then(
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