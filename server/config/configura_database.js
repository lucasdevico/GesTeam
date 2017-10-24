// nodemon confir/configura_database
var mongoose = require('mongoose');
var app = require('./express');

require('./database')('localhost/GesTeam');

console.log('--> Carregando Models');
var modelEstado = mongoose.model('Estado');
var modelContador = mongoose.model('Contador');
var modelStatus = mongoose.model('Status');
var modelPosicao = mongoose.model('Posicao');
console.log('');

/*
console.log('--> Limpar coleções...');
modelEstado.collection.drop();
modelContador.collection.drop();

console.log('--> Incluir Estados/Cidades...');
var listDadosEstadoJSON = require('./dados/estadosCidades');

for (var i = 0; i <= (listDadosEstadoJSON.length-1); i++){
	var bd = new modelEstado(listDadosEstadoJSON[i]);
	bd.save(function(err){
		if (err) return console.log(err);
	});	
};
console.log('');

console.log('--> Iniciando contadores...');
var bd = new modelContador({_id: "codigoIdentificacaoTime", sequence_value: 1000});
bd.save(function(err){
	if (err) return console.log(err);
});	
console.log('');
*/
console.log('--> Incluir Status...');
modelStatus.collection.drop();

var listStatus = [];

listStatus.push({chave: "GENERICO", descricao: "Ativo"});
listStatus.push({chave: "GENERICO", descricao: "Inativo"});
listStatus.push({chave: "PLANTEL", descricao: "Ativo"});
listStatus.push({chave: "PLANTEL", descricao: "Inativo"});
listStatus.push({chave: "PLANTEL", descricao: "Bloqueado Pgto."});
listStatus.push({chave: "PLANTEL", descricao: "Machucado"});

for (var i = 0; i <= (listStatus.length-1); i++){
	var bd = new modelStatus(listStatus[i]);
	bd.save(function(err){
		if (err) return console.log(err);
	});
};
console.log('');

console.log('--> Incluir Posição...');
modelPosicao.collection.drop();

var listaPosicao = [];

listaPosicao.push({modalidade: "FUTSAL", descricao: "Goleiro"});
listaPosicao.push({modalidade: "FUTSAL", descricao: "Fixo"});
listaPosicao.push({modalidade: "FUTSAL", descricao: "Ala"});
listaPosicao.push({modalidade: "FUTSAL", descricao: "Pivô"});

for (var i = 0; i <= (listaPosicao.length-1); i++){
	var bd = new modelPosicao(listaPosicao[i]);
	bd.save(function(err){
		if (err) return console.log(err);
	});
};
console.log('');

console.log('Fim da execução. Ctrl + C para finalizar.');