const assert = require('assert');
const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UserSchema = require('../db/strategies/postgres/schemas/userSchema');

let app = {};
const USER = {
    username: 'XuxaSilva', 
    password: '123'
};

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$fdjT9i2iO1.bwGnIv8xSu.waVIARJzBvyovT1I68Bnw/BLjySdzgK'
}

describe('Auth test Suite', function() {

    this.beforeAll( async () => {
        app = await api;

        const conPostgres = await Postgres.connect();
        const model = await Postgres.defineModel(conPostgres, UserSchema);
        const postgres = await new Context(new Postgres(conPostgres, model));
        await postgres.update(null, USER_DB, true);
    });

    it('Deve obter um Token', async () => {

        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(dados.token.length > 10);

    });


    it('deve voltar não autorizado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'batata',
                password: 'batata'
            }
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.deepEqual(statusCode, 401);
        assert.ok(dados.error, 'Unauthorized');

    });
});