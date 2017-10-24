module.exports = function(app) {
    var api = app.api.posicao;
    app.get('/posicao/listar/:modalidade', api.listar);
    app.get('/posicao/obter/:id', api.obter);
};