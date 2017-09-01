// nodemon confir/configura_database
var mongoose = require('mongoose');
var app = require('./express');

require('./database')('localhost/GesTeam');

console.log('--> Carregando Models');
var modelEstado = mongoose.model('Estado');
var modelContador = mongoose.model('Contador');
console.log('');

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

console.log('Fim da execução. Ctrl + C para finalizar.');