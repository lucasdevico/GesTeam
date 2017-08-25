module.exports = function(app) {
    var api = app.api.auth;
    var apiUtils = app.api.utils;
    app.post('/autenticar', api.autentica);
    app.get('/utils/listarEstados', apiUtils.listarEstados);
    app.get('/utils/listarCidades/:siglaEstado', apiUtils.listarCidades);
    app.use('/*', api.verificaToken);
};