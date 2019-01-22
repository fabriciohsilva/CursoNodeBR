/*
0 - obter um usuário
1 - obter o numero do telefone de um usuario pelo seu id
2 - obter o endereço do usuário pelo id
*/
const util = require('util');
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    return new Promise(function resolverPromise(resolve, reject){
        setTimeout(function () {
        return resolve({
            id: 1,
            nome: 'Batman',
            dataNascimento: new Date()
        });    
        }, 1000);
    });    
}

function obterTelefone(idUsuario) {
    return new Promise(function resolverPromise(resolve, reject){
        setTimeout(() => {
            return resolve({
                telefone: '988099800',
                ddd: '015'
            });
        }, 1000);
    });
}

function obterEndereco(idUsuario, callback) {
        setTimeout(() => {
            return callback(null, {
                logradouro: 'rua das peras',
                numero: '15'
            });
        }, 1000);
}

function resolverUsuario(erro, usuario) {
    console.log(usuario);
}

main();

async function main(){
    try {
        console.time('Medida-Promise');
        const usuario = await obterUsuario();
        //const telefone = await obterTelefone(usuario.id);
        //const endereco = await obterEnderecoAsync(usuario.id);
        const resultado = await Promise.all([
            obterTelefone(usuario.id),
            obterEnderecoAsync(usuario.id)
        ]);
        
        const telefone = resultado[0];
        const endereco = resultado[1];
        
        console.log(`
            Nome: ${usuario.nome},
            Telefone: (${telefone.ddd}) ${telefone.telefone},
            Endereço: ${endereco.logradouro}, ${endereco.numero},
        `);
        console.timeEnd('Medida-Promise');
    }
    catch(error){
        console.error('Não foi possivel realizar a operação', error);
    }
}

// const usuarioPromise = obterUsuario(); 
    
//     usuarioPromise
//     .then(function (usuario){
//         return obterTelefone(usuario.id)
//             .then(function resolverTelefone(result){
//                 return {
//                     usuario: {
//                         nome: usuario.nome,
//                         id: usuario.id
//                     },
//                     telefone: result
//                 }
//             })
//     })
//     .then(function(resultado){
//         const endereco = obterEnderecoAsync(resultado.usuario.id);
//         return endereco.then(function resolverEndereco(result){
//             return{
//                 usuario:  resultado.usuario,
//                 telefone: resultado.telefone,
//                 endereco: result
//             }
//         });
//     })
//     .then(function (resultado){
//         console.log(`
//              Nome: ${resultado.usuario.nome},
//              Telefone: ${resultado.telefone.ddd} ${resultado.telefone.telefone},
//              Endereço: ${resultado.endereco.logradouro}, ${resultado.endereco.numero},
//          `);
//     }).catch(function(error){
//         console.error('Não foi possivel obter o usuário', error);
//     });

// obterUsuario(function resolverUsuario(error, usuario){
//     if (error) {
//         console.error('Não foi possivel obter o usuário', error);
//         return;
//     }

//     obterTelefone(usuario.id, function obterTelefone(error1, telefone){
//         if (error1) {
//             console.error('Não foi possivel obter o telefone', error1);
//             return;
//         }
//         obterEndereco(usuario.id, function obterEndereco(error2, endereco){
//             if (error2) {
//                 console.error('Não foi possivel obter o telefone', error2);
//                 return;
//             }
//             console.log(`
//             Nome: ${usuario.nome},
//             Telefone: ${telefone.ddd} ${telefone.telefone},
//             Endereço: ${endereco.logradouro}, ${endereco.numero},
//         `);
//         });       
//     });    
// });

