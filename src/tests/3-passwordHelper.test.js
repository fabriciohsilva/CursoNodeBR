const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper');

const SENHA = 'PLATINUM@200';
const HASH = '$2b$04$E6AntiT.O0G04cXCMZH7b.DJ1rNFcBPEsUc0TLwiryXiKm5pHQq96';

describe('UserHelper teste suite', function() {

    it('deve gerar um hash a partir de uma senha', async() => {
        const result = await PasswordHelper.hashPassword(SENHA);
        //console.log('result: ', result);
        assert.ok(result.length > 10);
    });

    it('Deve comparar uma senha e um hash', async() => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH);
        assert.ok(result);
    });

});