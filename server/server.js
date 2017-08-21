var http = require('http');
var app = require('./config/express');

require('./config/database')('localhost/GesTeam');

var porta = process.env.PORT || 3000;
var server = http.createServer(app).listen(porta, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('GesTeam listening at http://%s:%s', host, port);
});