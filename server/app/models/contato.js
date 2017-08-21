var mongoose = require('mongoose');

var schema = mongoose.Schema({
	telefone1: {
		type: String,
		required: true
	},
	telefone2: {
		type: String,
		required: false
	},
	email:{
		type: String,
		required: true
	},
	permiteSMS: {
		type: Boolean,
		required: false
	},
	permiteEmail: {
		type: Boolean,
		required: false
	}
});

mongoose.model('Contato', schema);