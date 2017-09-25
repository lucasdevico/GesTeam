var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = mongoose.Schema({
	nome: {
		type: String,
		required: true
	},
	dataNascimento: {
		type: Date,
		required: true
	},
	login: {
		type: String,
		required: true
	},
	senha: {
		type: String,
		required: true
	},
	contato: {
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
	},
	acessos: [{
		_time: {
			type: Schema.Types.ObjectId,
			ref: 'Time'
		},
		bloqueado: {
			type: Boolean,
			required: false,
			default: false
		}
	}]
});

mongoose.model('Usuario', usuarioSchema);