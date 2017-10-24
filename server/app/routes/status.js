module.exports = function(app) {
    var api = app.api.status;
    app.get('/status/listar/:chave', api.listar);
    app.get('/status/obter/:id', api.obter);
};