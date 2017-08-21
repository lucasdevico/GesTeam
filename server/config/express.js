var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('../client'));
app.use(bodyParser.json());

app.set('secret', 'MaLiBu28032007FuTsAl');

consign({cwd: 'app'})
	.include('models')
	.then('api')
	.then('routes/auth.js')
	.then('routes')
	.into(app);

module.exports = app;