module.exports = function(app) {
    var api = app.api.auth;
    var apiUtils = app.api.utils;
    var apiUsuario = app.api.usuario;
    var apiTime = app.api.time;
    app.post('/autenticar', api.autentica);
    app.get('/utils/listarEstados', apiUtils.listarEstados);
    app.get('/utils/listarCidades/:siglaEstado', apiUtils.listarCidades);
    app.get('/usuario/verificarLoginExistente/:login', apiUsuario.verificarLoginExistente);
    app.get('/usuario/verificarLoginExistente/:login/:id', apiUsuario.verificarLoginExistente);
    app.get('/usuario/verificarEmailExistente/:email', apiUsuario.verificarEmailExistente);
    app.get('/usuario/verificarEmailExistente/:email/:id', apiUsuario.verificarEmailExistente);
    app.get('/time/verificarNomeTimeExistente/:nomeTime', apiTime.verificarNomeTimeExistente);
    app.get('/time/verificarNomeTimeExistente/:nomeTime/:id', apiTime.verificarNomeTimeExistente);
    app.post('/usuario/cadastrar', apiUsuario.cadastrarUsuario);
    app.use('/*', api.verificaToken);
};