//npm install mongose
const Mongoose = require('mongoose');

Mongoose.connect('mongodb://fabriciohsilva:minhasenha@localhost:27017/herois', { useNewUrlParser: true }, (error) => {
	if (!error) return;
	console.log('Falha na Conexão!!');
});

const connection = Mongoose.connection;
connection.once('open', () => console.log('Database online'));

const heroiSchema = new Mongoose.Schema({
	nome: {
		type: String,
		required: true
	},
	poder: {
		type: String,
		required: true
	},
	insertedAt: {
		type: Date,
		default: new Date()
	}
});

const model = Mongoose.model('herois', heroiSchema);

async function main() {
	const resultCadastrar = await model.create({
		nome: 'Batman',
		poder: 'Dinheiro'
	});
	console.log('resultCadastrar: ', resultCadastrar);

	const listItens = await model.find({});

	console.log('listItens: ', listItens);
}

main();
