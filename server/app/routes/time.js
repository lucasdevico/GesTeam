module.exports = function(app) {
    var api = app.api.time;
    app.put('/time/atualizar/:id', api.atualizar);
    app.get('/time/obter/:id', api.obter);
};