var mongoose = require('mongoose');

var schema = mongoose.Schema({
	codigoIdentificacao: {
		type: String,
		required: true
	},
	nome: {
		type: String,
		required: true
	},
	nomeCompleto: {
		type: String,
		required: true
	},
	localizacao: {
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
	imagemSimbolo: {
		type: String,
		required: false,
		default: '../img/simbolos/semsimbolo.png'
	},
	coresUniforme1: {
		type: String,
		required: false,
		default: '#000;#000;#000'
	},
	coresUniforme2: {
		type: String,
		required: false,
		default: '#fff;#fff;#fff'
	},
	status: {
		type: String,
		required: true
	},
	dataFundacao: {
		type: Date,
		required: true
	},
	dataCadastro: {
		type: Date,
		required: true
	},
	modalidade: {
		type: String,
		required: true
	},
	qtdQuadros: {
		type: Number,
		required: true
	}
});

mongoose.model('Time', schema);