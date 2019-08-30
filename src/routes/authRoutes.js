const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');
const PasswordHelper = require('./../helpers/passwordHelper');

const failAction = (request, headers, error) => {
    throw error;
};


const USER = {
    username: 'XuxaSilva',
    password: '123'
};

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super();
        this.secret = secret;
        this.db = db;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter Token',
                notes: 'Faz Login com user e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                },
                handler: async (request) => {
                    const {
                        username,
                        password
                    } = request.payload;

                    // if ((username.toLowerCase() !== USER.username.toLowerCase()) ||
                    //     (password !== USER.password)) {
                    //     return Boom.unauthorized();
                    // }

                    const [user] = await this.db.read({
                        username: username.toLowerCase()
                    });

                    if(!user) {
                        return Boom.unauthorized(`The user dosen't exist!`);
                    }

                    const match = await PasswordHelper.comparePassword(password, user.password);

                    if(!match) {
                        return Boom.unauthorized(`User or password invalid`);
                    }

                    const token = Jwt.sign({
                        username: username,
                        id: user.id
                    }, this.secret);



                    return { token };

                }
            }
        }
    }


}

module.exports = AuthRoutes;