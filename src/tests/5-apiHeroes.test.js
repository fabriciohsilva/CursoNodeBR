const assert = require('assert');
const api = require('../api');

let app = {};

const MOCK_HERO = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
};

const MOCK_HERO_INIT = {
    nome: 'iron man',
    poder: 'money'
};

let MOCK_ID = '';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFTaWx2YSIsImlkIjoxLCJpYXQiOjE1NjYwNzk0Nzd9.X6qr7eZ_KTbkzbxUgVEUYcmiIt8FFGAAAJpgc5M8OF8';

const headers = {
    authorization: TOKEN
}

describe('Suite de testes - API Heroes', function() {

    this.beforeAll(async () => {
        app = await api;

        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            headers,
            payload: MOCK_HERO_INIT
        });

        const dados = JSON.parse(result.payload);
        MOCK_ID = dados._id

    });

    it('List heroes GET /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=10',
            headers
        });

        const dados = JSON.parse(result.payload);        
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));

    });

    it('List heroes GET /heroes - return only 10 records', async () => {
        const MAX_SIZE = 3;
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${MAX_SIZE}`,
            headers
        });

        const dados = JSON.parse(result.payload);        
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(dados.length === MAX_SIZE);
    });

    it('List heroes GET /heroes - params error', async () => {
        const MAX_SIZE = 'AAA';
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${MAX_SIZE}`,
            headers
        });

        const errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
              "source": "query",
              "keys": [
                "limit"
              ]
            }
          };

        assert.deepEqual(result.statusCode, 400);
        assert.deepEqual(result.payload, JSON.stringify(errorResult));
    });

    it('List heroes GET /heroes - filter item', async () => {
        //const NAME = 'Capitão América-1565662874651';
        const NAME = 'Capitão América-1567135692513';
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=1000&nome=${NAME}`,
            headers
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);   
        console.log(dados)     
        assert.deepEqual(statusCode, 200);
        assert.ok(dados[0].nome === NAME);
    });

    it('Create heroes POST /heroes', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            headers,
            payload: MOCK_HERO
        });

        const {message, _id} = JSON.parse(result.payload);        
        const statusCode = result.statusCode;

        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(message, "Heroi cadastrado com sucesso");

    });

    it('Update heroes PATCH /heroes/:id', async () => {
        const expected = {poder: "inteligencia"};

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${MOCK_ID}`,
            headers,
            payload: expected
        });

        const dados = JSON.parse(result.payload);        
        const statusCode = result.statusCode;

        assert.ok(statusCode === 200);
        assert.deepEqual(dados.message, "Heroi atualizado com sucesso");

    });

    it('Update heroes PATCH /heroes/:id - não deve atualizar com id incorreto', async () => {
        const _id = '5d521e819043a0187c249b40';
        const expected = { 
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'id Não encontrado no banco'
        };

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            headers,
            payload: {poder: "inteligencia"}
        });

        const dados = JSON.parse(result.payload);        
        const statusCode = result.statusCode;

        assert.ok(statusCode === 412);
        assert.deepEqual(dados, expected);

    });

    it('Delete heroes DELETE /heroes/:id', async () => {

        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${MOCK_ID}`,
            headers
        });

        const dados = JSON.parse(result.payload);        
        const statusCode = result.statusCode;

        assert.ok(statusCode === 200);
        assert.deepEqual(dados.message, 'Heroi removido com sucesso!');

    });

    it('Delete heroes DELETE /heroes/:id - não deve remover', async () => {
        const _id = '5d521e819043a0187c249b40';
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'id Não encontrado no banco'
        };

        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`,
            headers
        });

        const dados = JSON.parse(result.payload);        
        const statusCode = result.statusCode;

        assert.ok(statusCode === 412);
        assert.deepEqual(dados, expected);

    });

    it('Delete heroes DELETE /heroes/:id - não deve remover - id invalido', async () => {
        const _id = 'ID_INVALIDO';
        const expected = { 
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred' };

        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`,
            headers
        });

        const dados = JSON.parse(result.payload);        
        const statusCode = result.statusCode;

        assert.ok(statusCode === 500);
        assert.deepEqual(dados, expected);

    });

});