var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaEstados = mongoose.Schema({
	estado: {
		type: String
	},
	estadoNome: {
		type: String
	},
	cidades: [{
		type: String
	}]
});

mongoose.model('Estado', schemaEstados);