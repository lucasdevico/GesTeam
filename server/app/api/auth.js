var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken'); // importando o módulo

module.exports = function(app) {

     var api = {};
     var modelUsuario = mongoose.model('Usuario');
     var modelTime = mongoose.model('Time');

     api.inserirUsuario = function(req, res){
        var timeMalibu = new modelTime({
            codigoIdentificacao: "0001",
            nome: "Malibu",
            descricao: "Malibu Futsal",
            localizacao: {
                cep: "02072001",
                logradouro: "Av. Conceição, 1310",
                complemento: "Apto. 4",
                bairro: "Carandirú",
                cidade: "São Paulo",
                UF: "SP"
            },
            contato: {
                telefone1: "11951694589",
                telefone2: null,
                email: "lucas.devico@gmail.com",
                permiteSMS: null,
                permiteEmail: null
            },
            imagemSimbolo: "../img/simbolos/semsimbolo.png",
            coresUniforme1: "#000;#000;#000",
            coresUniforme1: "#fff;#fff;#fff",
            status: "Ativo",
            dataFundacao: new Date(2007,03,28),
            dataCadastro: new Date(),
            modalidade: "Futsal",
            qtdQuadros: 2
        });

        timeMalibu.save(function(err){
            if (err) return handleError(err);

            var usuarioLucas = new modelUsuario({
                login: "lucas.devico",
                senha: "123456",
                contato: {
                    telefone1: "11951694589",
                    telefone2: null,
                    email: "lucas.devico@gmail.com",
                    permiteSMS: null,
                    permiteEmail: null
                },
                acessos: [
                    {
                        _time: timeMalibu._id,
                        bloqueado: false
                    }
                ]
            });

            usuarioLucas.save(function(err){
                if(err) handleError(err);
            });
        });
     };

     api.autentica = function(req, res) {
         modelUsuario.findOne({
             login: req.body.login,
             senha: req.body.senha
         })
         .populate('acessos._time')
         .then(function(usuario) {
             if (!usuario) {
                 res.sendStatus(401);
             } else {
                 var token = jwt.sign( {login: usuario.login}, app.get('secret'), {
                     expiresIn: 86400 // valor em segundo, aqui temos um total de 24 horas
                 });
                 res.set('x-access-token', token); // adicionando token no cabeçalho de resposta
                 res.json(usuario); // enviando a resposta
             }
         });
     };

    api.verificaToken = function(req, res, next) {

         var token = req.headers['x-access-token']; // busca o token no header da requisição

         if (token) {
             console.log('Token recebido, decodificando');
             jwt.verify(token, app.get('secret'), function(err, decoded) {
                 if (err) {
                     console.log('Token rejeitado');
                     return res.sendStatus(401);
                 } else {
                     console.log('Token aceito')
                     // guardou o valor decodificado do token na requisição. No caso, o login do usuário.
                     req.usuario = decoded;    
                     next();
                  }
            });
        } else {
            console.log('Nenhum token enviado');
            return res.sendStatus(401);
          }
    }

    return api;
};