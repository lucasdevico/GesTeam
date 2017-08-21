module.exports = function(uri){
	var mongoose = require('mongoose');

    mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://' + uri, { useMongoClient: true });

	mongoose.connection.on('connected', function() {
	    console.log('Conexão estabelecida com o banco de dados.')
	});

	mongoose.connection.on('error', function(error) {
        console.log('Erro na conexão com o banco de dados: ' + error);
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Desconectado do MongoDB')
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Aplicação terminada, conexão fechada')
            process.exit(0);
        });
    })
};