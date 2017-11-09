module.exports = function(app) {
    var api = app.api.jogador;
    app.get('/jogadores/listar/:idTime/:palavraChave?/:pePreferido?/:status?/:posicao?', api.listar);
    app.get('/jogadores/obter/:id', api.obter);
    app.post('/jogadores/inserir', api.inserir);
    app.put('/jogadores/atualizar/:id', api.atualizar);
    app.post('/jogadores/excluir/:id', api.excluir);
};