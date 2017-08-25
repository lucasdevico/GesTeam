var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelEstado = mongoose.model('Estado');

	api.listarEstados = function(req, res){
		modelEstado.find().sort({'estado':1}).then(function(lstEstados){
	    	res.json(lstEstados);
	    }, function(error){
			res.status(500).json(error);
	    });
	};

	api.listarCidades = function(req, res){
		var siglaEstado = req.params.siglaEstado;
		modelEstado.find({'estado': siglaEstado}).sort({'cidades':1}).then(function(lstCidades){
	    	res.json(lstCidades);
	    }, function(error){
			res.status(500).json(error);
	    });
	};

	return api;
}