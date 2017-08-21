var mongoose = require('mongoose');

var schema = mongoose.Schema({
	cep: {
		type: String,
		required: false
	},
	logradouro: {
		type: String,
		required: false
	},
	complemento: {
		type: String,
		required: false
	},
	bairro:{
		type: String,
		required: false
	},
	cidade: {
		type: String,
		required: false
	},
	UF: {
		type: String,
		required: false
	}
});

mongoose.model('Localizacao', schema);