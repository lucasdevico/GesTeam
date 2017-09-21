var mongoose = require('mongoose');

module.exports = function(app) {
	var api = {};

	var modelEstado = mongoose.model('Estado');

	api.listarEstados = function(req, res){
		modelEstado.find().sort({'estado':1}).then(function(lstEstados){
	    	res.json(lstEstados);
	    }, function(error){
			res.status(500).json(error);
	    });
	};

	api.listarCidades = function(req, res){
		var siglaEstado = req.params.siglaEstado;
		modelEstado.find({'estado': siglaEstado}).sort({'cidades':1}).then(function(lstCidades){
	    	res.json(lstCidades);
	    }, function(error){
			res.status(500).json(error);
	    });
	};

	api.uploadSimbolo = function(req, res){
		var nomeArquivo = "";
		var multer = require('multer');
		var storage = multer.diskStorage({ //multers disk storage settings
		    destination: function (req, file, cb) {
		        cb(null, './../client/img/simbolos/')
		    },
		    filename: function (req, file, cb) {
		        var datetimestamp = Date.now();
		        nomeArquivo = req.userId + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
		        cb(null, nomeArquivo)
		    }
		});
		
		var upload = multer({ //multer settings
		    storage: storage
		}).single('file');

		upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            res.json({error_code:0,err_desc:null, nome_arquivo: nomeArquivo});
        });
	};

	return api;
}