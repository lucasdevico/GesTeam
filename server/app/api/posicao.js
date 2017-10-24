var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelPosicao = mongoose.model('Posicao');

	api.listar = function(req, res){
		var modalidade = req.params.modalidade;
		
		modelPosicao.find({modalidade: modalidade})
		.then(function(lstPosicao){
			res.json(lstPosicao);
		}, function(error){
			res.status(500).json(error);
		});
	};

	api.obter = function(req, res){
		var idPosicao = req.params.id;
		modelPosicao.findOne({_id: idPosicao}).then(function(posicao){
			res.json(posicao);
		}, function(error){
			res.status(500).json(error);
		});
	};

	return api;
}