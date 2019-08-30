## ----- postgres

docker run \
  --name postgres \
  -e POSTGRES_USER=fabriciohsilva \
  -e POSTGRES_PASSWORD=minhasenha \
  -e POSTGRES_DB=heroes \
  -p 5432:5432 \
  -d \
  postgres

docker ps
docker exec -it postgres /bin/bash

docker run \
  --name adminer \
  -p 8080:8080 \
  --link postgres:postgres \
  -d \
  adminer


## ----- MongoDB
docker run \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=e \
  -d \
  mongo:4

docker run \
  --name mongoclient \
  -p 3000:3000 \
  --link mongodb:mongodb \
  -d \
  mongoclient/mongoclient


docker exec -it mongodb \
  mongo --host localhost -u admin -p senhadmin --authenticationDatabase admin \
  --eval "db.getSiblingDB('heroes').createUser({user: 'fabriciohsilva', pwd: 'minhasenha', roles: [{role: 'readWrite', db: 'heroes'}]})"


##--shortcuts
docker start postgres
docker start adminer
docker start mongodb
docker start mongoclient