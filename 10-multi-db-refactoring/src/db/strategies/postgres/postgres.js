const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
	constructor(connection, schema) {
		super();
		this._schema = schema;
		this._connection = connection;
	}

	async create(item) {
		return this._schema.create(item, { raw: true });
	} //end create(item)

	async read(item) {
		return this._schema.findAll({ where: item, raw: true });
	} //end read(item)

	async update(id, item) {
		return this._schema.update(item, { where: { id: id } });
	} //end update(id, item)

	async delete(id) {
		const query = id ? { id } : {};
		return this._schema.destroy({ where: query });
	} //end update(id, item)

	async isConnected() {
		try {
			// await this._connect();
			await this._connection.authenticate();
			return true;
		} catch (error) {
			console.error('fail!', error);
			return false;
		}
	} //end isConnected

	static async defineModel(connection, schema) {
		const model = connection.define(schema.name, schema.schema, schema.options);
		await model.sync();
		return model;
	} //end defineModel()

	static async connect() {
		const connection = new Sequelize(
			'heroes', //database
			'fabriciohsilva', // user
			'minhasenha', //senha
			{
				host: 'localhost',
				dialect: 'postgres',
				quoteIdentifiers: false,
				operatorsAliases: false,
				logging: false
			}
		);
		return connection;
	} //end conect()
} //end class Postgres extends ICrud

module.exports = Postgres;
