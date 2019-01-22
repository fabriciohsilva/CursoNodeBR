const service = require('./service');

Array.prototype.meuMap = function(callback){
    
}

async function main(){
    try {
        const results = await service.obterPessoas(`a`);
        let names = [];

        console.time('ForEach');
        results.results.forEach(function(item) {
             names.push(item.name);
        });
        console.timeEnd('ForEach');

        console.log('(ForEach)nomes: ', names);

        console.time('Map');
        let names2 = results.results.map(function(pessoa){
            return pessoa.name
        });
        console.timeEnd('Map');

        console.log('(ForEach)nomes: ', names2);

        
    } catch (error) {
       console.error('Erro na execução: ', error) 
    }
}

main();