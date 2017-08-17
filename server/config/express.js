var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('../client'));
app.use(bodyParser.json());

app.set('secret', 'MaLiBu28032007FuTsAl');

consign({cwd: 'app'})
	.into(app);

module.exports = app;