var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('../client'));
app.use(bodyParser.json());

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('secret', 'MaLiBu28032007FuTsAl');

consign({cwd: 'app'})
	.include('models')
	.then('api')
	.then('routes/auth.js')
	.then('routes')
	.into(app);

module.exports = app;