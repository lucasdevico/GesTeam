var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelStatus = mongoose.model('Status');

	api.listar = function(req, res){
		var chave = req.params.chave;
		
		modelStatus.find({chave: chave})
		.sort( { descricao: 1 } )
		.then(function(lstStatus){
			res.json(lstStatus);
		}, function(error){
			res.status(500).json(error);
		});
	};

	api.obter = function(req, res){
		var idStatus = req.params.id;
		modelStatus.findOne({_id: idStatus}).then(function(status){
			res.json(status);
		}, function(error){
			res.status(500).json(error);
		});
	};

	return api;
}