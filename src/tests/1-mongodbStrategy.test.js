const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroiSchema');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
	nome: 'Mulher Maravilha',
	poder: 'Laço'
};

const MOCK_HEROI_DEFAULT = {
	nome: `Capitão América-${Date.now()}`,
	poder: 'Referências'
};

const MOCK_HEROI_ATUALIZAR = {
	nome: `Patolino-${Date.now()}`,
	poder: 'Lingua Pressa'
};

let MOCK_HEROI_ID = '';

let context = {};

describe('MongoDB Suite de testes', function() {
	this.beforeAll(async () => {
		const connection = MongoDB.connect();
		context = new Context(new MongoDB(connection, HeroiSchema));

		await context.create(MOCK_HEROI_DEFAULT);
		const result = await context.create(MOCK_HEROI_ATUALIZAR);
		MOCK_HEROI_ID = result._id;
	});

	it('Verificar Conexão', async () => {
		const result = await context.isConnected();
		const expected = 'Conectado';

		assert.deepEqual(result, expected);
	});

	it('Create', async () => {
		const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
		assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
	});

	it('Read', async () => {
		const [ { nome, poder } ] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome });
		const result = { nome, poder };

		assert.deepEqual(result, MOCK_HEROI_DEFAULT);
	});

	it('Update', async () => {
		const result = await context.update(MOCK_HEROI_ID, { nome: 'Michael Jackson' });

		assert.deepEqual(result.nModified, 1);
	});

	it('Delete', async () => {
		const result = await context.delete(MOCK_HEROI_ID);
		assert.deepEqual(result.n, 1);
	});
});
