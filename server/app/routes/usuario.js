module.exports = function(app) {
    var api = app.api.usuario;
    app.put('/usuario/atualizar/:id', api.atualizar);
    app.get('/usuario/obter/:id', api.obter);
};