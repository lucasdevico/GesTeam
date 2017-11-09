var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jogadorSchema = mongoose.Schema({
	nome: {
		type: String,
		required: true
	},
	apelido: {
		type: String,
		required: true
	},
	contato: {
		telefone1: {
			type: String,
			required: false
		},
		telefone2: {
			type: String,
			required: false
		},
		email:{
			type: String,
			required: false
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
	dataNascimento: {
		type: Date,
		required: true
	},
	pePreferido:{
		type: String,
		required: false
	},
	posicao: {
		type: String,
		required: false
	},
	classificacao:{
		type: Number,
		required: false
	},
	_status:{
		type: Schema.Types.ObjectId,
		ref: 'Status'
	},
	_time: {
		type: Schema.Types.ObjectId,
		ref: 'Time'
	}
}, { collection: 'jogadores' });

mongoose.model('Jogador', jogadorSchema);