#!/bin/bash
set -e

# Verificar se o volume está vazio (primeira inicialização)
if [ ! -f /data/db/.mongodb_keyfile_initialized ]; then
  echo "Primeira inicialização detectada - criando usuário admin..."
  
  # Iniciar MongoDB sem auth temporariamente
  mongod --replSet rs0 --bind_ip_all --keyFile /etc/mongo-keyfile --fork --logpath /var/log/mongodb.log
  
  # Aguardar MongoDB iniciar
  sleep 5
  
  # Criar usuário admin
  mongosh --host localhost:27017 admin --eval "
  try {
    db.createUser({
      user: '${MONGODB_USERNAME:-admin}',
      pwd: '${MONGODB_PASSWORD:-admin123}',
      roles: [{ role: 'root', db: 'admin' }]
    })
    print('Admin user created successfully')
  } catch (err) {
    if (err.codeName === 'DuplicateKey') {
      print('Admin user already exists')
    } else {
      throw err
    }
  }
  "
  
  # Inicializar replica set
  mongosh --host localhost:27017 admin --eval "
  try {
    rs.status()
    print('Replica set already initialized')
  } catch (err) {
    rs.initiate({_id:'rs0',members:[{_id:0,host:'mongodb:27017'}]})
    print('Replica set initialized')
  }
  "
  
  # Criar usuário no database específico
  mongosh -u ${MONGODB_USERNAME:-admin} -p ${MONGODB_PASSWORD:-admin123} --authenticationDatabase admin --host localhost:27017 ${MONGODB_DATABASE:-mevi_database} --eval "
  try {
    db.createUser({
      user: '${MONGODB_USERNAME:-admin}',
      pwd: '${MONGODB_PASSWORD:-admin123}',
      roles: [{ role: 'readWrite', db: '${MONGODB_DATABASE:-mevi_database}' }]
    })
    print('Database user created successfully')
  } catch (err) {
    if (err.codeName === 'DuplicateKey') {
      print('Database user already exists')
    } else {
      throw err
    }
  }
  "
  
  # Parar MongoDB temporário
  mongosh --host localhost:27017 admin --eval "db.shutdownServer()"
  
  # Marcar como inicializado
  touch /data/db/.mongodb_keyfile_initialized
fi

# Iniciar MongoDB com auth
exec mongod --replSet rs0 --bind_ip_all --auth --keyFile /etc/mongo-keyfile

