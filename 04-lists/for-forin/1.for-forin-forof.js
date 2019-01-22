const service = require('./service');

async function main(){
    try {
        const result = await service.obterPessoas('a');
        let names = [];

        console.time('TempoFor');
        for (let i = 0; i < result.results.length; i++) {
            const pessoa = result.results[i];
            names.push(pessoa.name);
        }
        console.timeEnd('TempoFor');

        console.log('(For)nomes: ', names);
        names = [];

        console.time('TempoForIn');
        for(let i in result.results){            
            const pessoa = result.results[i];
            names.push(pessoa.name);        
        }
        console.timeEnd('TempoForIn');

        console.log('(ForIn)nomes: ', names);
        names = [];

        console.time('TempoForOf');
        for(pessoa of result.results){
            names.push(pessoa.name);
        }
        console.timeEnd('TempoForOf');

        console.log('(ForIn)nomes: ', names);
        
    } catch (error) {
        console.error('Erro de execução:', error);
    }
}

main();