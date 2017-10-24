var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statusSchema = mongoose.Schema({
	chave: {
		type: String,
		required: true
	},
	descricao: {
		type: String,
		required: true
	}
});

mongoose.model('Status', statusSchema);