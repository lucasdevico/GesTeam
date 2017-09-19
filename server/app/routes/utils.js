module.exports = function(app) {
    var api = app.api.utils;
    app.post('/utils/simbolo/upload', api.uploadSimbolo);
};