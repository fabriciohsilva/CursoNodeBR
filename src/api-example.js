const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroSchema = require('./db/strategies/mongodb/schemas/heroiSchema');


const app = new Hapi.Server({
    port: 5000
});

async function main() {

    const conn = MongoDb.connect();
    const context = new Context(new MongoDb(conn, HeroSchema));
    app.route([
        {
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                return context.read();
            }
        }
    ]);

    await app.start();

    console.log("Servidor rodando na porta", app.info.port);
}

main();