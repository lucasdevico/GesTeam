// nodemon confir/configura_database
var mongoose = require('mongoose');
var app = require('./express');

require('./database')('localhost/GesTeam');

console.log('--> Carregando Models');
var modelEstado = mongoose.model('Estado');
var modelContato = mongoose.model('Contato');
console.log('');

console.log('--> Limpar tabela Estados/Cidades...');
modelEstado.collection.drop();

console.log('--> Incluir Estados/Cidades...');
var listDadosEstadoJSON = require('./dados/estadosCidades');

for (var i = 0; i <= (listDadosEstadoJSON.length-1); i++){
	var bd = new modelEstado(listDadosEstadoJSON[i]);
	bd.save(function(err){
		if (err) return console.log(err);
	});	
};
console.log('');

console.log('Fim da execução. Ctrl + C para finalizar.');