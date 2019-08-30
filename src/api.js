const { config } = require('dotenv');
const { join } = require('path');
const  { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'a env é inválida. deve ser dev ou prod');

const configPath = join(__dirname, './config/', `.env.${env}`);
config({
    path: configPath
});

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwt = require('hapi-auth-jwt2');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const Postgres = require('./db/strategies/postgres/postgres');
const UserSchema = require('./db/strategies/postgres/schemas/userSchema');
const HeroSchema = require('./db/strategies/mongodb/schemas/heroiSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');
const UtilRoute = require('./routes/utilRoutes');
const JWT_SECRET = process.env.JWT_KEY;


const app = new Hapi.Server({
    port: process.env.PORT
});

function mapRoutes(instance, methods) {    
    return methods.map( method => instance[method]());    
}

async function main() {

    const conn = MongoDb.connect();
    const context = new Context(new MongoDb(conn, HeroSchema));
    const conPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(conPostgres, UserSchema);
    const contextPostgres = new Context(new Postgres(conPostgres, model));

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR - fabricioh.silva',
            version: 'v1.0'
        }
    };

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (dado, request) => {
            //verifica no bd se user continua ativo

            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase()
            });

            if (!result) {
                return {
                    isValid: false
                }    
            }

            return {
                isValid: true
            }
        }
    });

    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
        ...mapRoutes(new UtilRoute(), UtilRoute.methods())
    ]
    );

    await app.start();

    console.log("Servidor rodando na porta", app.info.port);

    return app;
}

module.exports = main();