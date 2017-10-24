var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var posicaoSchema = mongoose.Schema({
	modalidade: {
		type: String,
		required: true
	},
	descricao: {
		type: String,
		required: true
	}
}, { collection: 'posicoes' });

mongoose.model('Posicao', posicaoSchema);