db.usuarios.insert({
	login: "lucas.devico",
	senha: "123456",
	contato: {
		telefone1: "11951694589",
		telefone2: null,
		email: "lucas.devico@gmail.com",
		permiteSMS: false,
		permiteEmail: true
	},
	acessos: [{
		time: {
			codigoIdentificacao: "0001",
			nome: "Malibu Futsal",
			descricao: "Malibu Futsal",
			localizacao: {},
			contato: {
				telefone1: "11951694589",
				telefone2: null,
				email: "lucas.devico@gmail.com",
				permiteSMS: null,
				permiteEmail: null
			},
			status: {

			},
			dataFundacao: new Date(2007,03,28),
			dataCadastro: new Date(),
			modalidade: {
				descricao: 'Futsal'
			},
			qtdQuadros: 2
		},
		bloqueado: false
	}]
});

db.usuarios.insert({
	login: "lucas.devico",
	senha: "123456",
	contato: {
		telefone1: "11951694589",
		telefone2: null,
		email: "lucas.devico@gmail.com",
		permiteSMS: null,
		permiteEmail: null
	},
	acessos: [{
			_time: db.times.findOne({_id: ObjectId("599b3172bce99a302804d377")})._id,
			bloqueado: false
		},
		{
			_time: ObjectId("599b31adbce99a302804d378"),
			bloqueado: false
		}
	]
});

db.usuarios.update(
   { login: "lucas.devico" },
   { $push: { 
   		acessos: {
	   		time: {
				codigoIdentificacao: "0002",
				nome: "Cantareira",
				descricao: "Cantareira Futebol e Samba",
				localizacao: {},
				contato: {
					telefone1: "11951694589",
					telefone2: null,
					email: "lucas.devico@gmail.com",
					permiteSMS: null,
					permiteEmail: null
				},
				status: {
				},
				dataFundacao: new Date(2007,01,01),
				dataCadastro: new Date(),
				modalidade: {
					descricao: 'Futsal'
				},
				qtdQuadros: 2
			},
			bloqueado: false
   		}
   	 } 
   }
);

db.times.insert({
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

db.times.insert({
	codigoIdentificacao: "0002",
	nome: "Cantareira Futsal",
	descricao: "Cantareira Futebol e Samba",
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
	dataFundacao: new Date(2007,01,01),
	dataCadastro: new Date(),
	modalidade: "Futsal",
	qtdQuadros: 2
});

db.times.insert({
	codigoIdentificacao: "0002",
	nome: "Cantareira Society",
	descricao: "Cantareira Futebol e Samba",
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
	dataFundacao: new Date(2007,01,01),
	dataCadastro: new Date(),
	modalidade: "Society",
	qtdQuadros: 2
});