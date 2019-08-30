// docker ps
// docker exec -it 587723d9b72e mongo -u fabriciohsilva -p minhasenha --authenticationDatabase herois

// show dbs;

// use herois;

// show collections;

db.herois.insert({
  nome: 'Flash',
  poder: 'Speed Force',
  dataNascimento: '1998-01-01'
});


for(i=1; i<=1000; i++){
  db.herois.insert({
    nome: `Clone-${i}`,
    poder: 'Speed Force',
    dataNascimento: '1998-01-01'
  });
};

db.herois.count();
db.herois.find();
db.herois.findOne();
db.herois.find().limit(1000).sort({nome: -1});
