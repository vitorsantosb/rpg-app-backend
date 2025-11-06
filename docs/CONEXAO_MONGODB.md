# 🔌 Guia de Conexão MongoDB

Este guia explica como conectar ao MongoDB e às réplicas de forma separada no seu computador.

## 📊 Situação Atual

Atualmente você tem **1 instância MongoDB** rodando como Replica Set:
- **PRIMARY**: `localhost:27017`
- **Database**: `mevi_database`
- **Replica Set**: `rs0`

## 🔗 Strings de Conexão

### Credenciais de Desenvolvimento Local
- **Usuário**: `admin`
- **Senha**: `admin123`
- **Database**: `mevi_database`
- **Auth Source**: `admin`

### 1. Conexão PRIMARY (Escrita)
```
mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&readPreference=primary&authSource=admin
```

### 2. Conexão SECONDARY (Leitura) - Mesmo servidor (atual)
```
mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&readPreference=secondaryPreferred&authSource=admin
```

### 3. Conexão Completa (Fallback)
```
mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&authSource=admin
```

## 🛠️ Como Conectar

### Usando MongoDB Compass (GUI)

1. **Baixe o MongoDB Compass**: https://www.mongodb.com/try/download/compass

2. **Conexão PRIMARY (Escrita)**:
   - Abra o Compass
   - Cole a string: `mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&readPreference=primary&authSource=admin`
   - Clique em "Connect"

3. **Conexão SECONDARY (Leitura)**:
   - Abra outra instância do Compass (ou nova aba)
   - Cole a string: `mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&readPreference=secondaryPreferred&authSource=admin`
   - Clique em "Connect"

### Usando mongosh (Terminal)

```bash
# Conectar ao PRIMARY
mongosh "mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&readPreference=primary&authSource=admin"

# Conectar ao SECONDARY (mesmo servidor, mas com preferência de leitura)
mongosh "mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&readPreference=secondaryPreferred&authSource=admin"

# Ou simplesmente
mongosh "mongodb://admin:admin123@localhost:27017/mevi_database?replicaSet=rs0&authSource=admin"
```

### Usando Docker Exec

```bash
# Conectar via Docker (com autenticação)
docker exec -it mongodb-rpg-app-backend mongosh -u admin -p admin123 --authenticationDatabase admin mevi_database

# Verificar status do replica set
docker exec mongodb-rpg-app-backend mongosh -u admin -p admin123 --authenticationDatabase admin --eval "rs.status()" --quiet
```

## 🔧 Configurando Réplicas Separadas (Recomendado para Produção)

Para ter réplicas **realmente separadas** (PRIMARY e SECONDARY em portas diferentes), você precisa:

### Opção 1: Adicionar SECONDARY no docker-compose.yml

Adicione um segundo serviço MongoDB:

```yaml
mongodb-secondary:
  container_name: "mongodb-secondary-rpg-app-backend"
  image: 'mongo:7.0'
  restart: always
  ports:
    - '27018:27017'  # Porta diferente
  volumes:
    - 'rpg-app-backend-mongodb-secondary:/data/db'
  networks:
    - rpg-app-backend
  command: mongod --replSet rs0 --bind_ip_all
  depends_on:
    mongodb:
      condition: service_healthy
```

Depois, adicione o SECONDARY ao replica set:

```bash
# Conectar ao PRIMARY
docker exec mongodb-rpg-app-backend mongosh --eval "
rs.add({
  _id: 1,
  host: 'mongodb-secondary:27017'
})
" --quiet
```

### Opção 2: Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# PRIMARY (Escrita)
MONGO_URI=mongodb://localhost:27017/mevi_database?replicaSet=rs0
MONGO_WRITE_URI=mongodb://localhost:27017/mevi_database?replicaSet=rs0&readPreference=primary

# SECONDARY (Leitura) - Quando tiver réplica separada
MONGO_READ_URI=mongodb://localhost:27018/mevi_database?replicaSet=rs0&readPreference=secondaryPreferred

# Conexão completa
MONGO_FULL_URI=mongodb://localhost:27017,localhost:27018/mevi_database?replicaSet=rs0
```

## 📝 Verificações Úteis

### Verificar Status do Replica Set
```bash
docker exec mongodb-rpg-app-backend mongosh --eval "rs.status()" --quiet
```

### Listar Databases
```bash
docker exec mongodb-rpg-app-backend mongosh --eval "show dbs" --quiet
```

### Listar Collections
```bash
docker exec mongodb-rpg-app-backend mongosh --eval "db.getCollectionNames()" mevi_database --quiet
```

### Verificar Conexões Ativas
```bash
docker exec mongodb-rpg-app-backend mongosh --eval "db.serverStatus().connections" --quiet
```

## 🎯 Uso no Código

### Conexão de Escrita (PRIMARY)
```typescript
import { GetWriteConnection } from '@database/database';

const connection = await GetWriteConnection();
// Usa: mongodb://localhost:27017/mevi_database?replicaSet=rs0&readPreference=primary
```

### Conexão de Leitura (SECONDARY)
```typescript
import { GetReadConnection } from '@database/database';

const connection = await GetReadConnection();
// Usa: mongodb://localhost:27017/mevi_database?replicaSet=rs0&readPreference=secondaryPreferred
```

## ⚠️ Notas Importantes

1. **Réplica Única**: Atualmente você tem apenas 1 membro no replica set. Para ter réplicas reais, precisa de múltiplas instâncias.

2. **Read Preference**: Mesmo com 1 servidor, você pode usar `readPreference=secondaryPreferred` para simular o comportamento. O MongoDB vai ler do PRIMARY se não houver SECONDARY.

3. **Transações**: Requerem conexão ao PRIMARY e replica set com pelo menos 1 membro.

4. **Performance**: Para desenvolvimento local, 1 instância é suficiente. Para produção, recomenda-se pelo menos 3 membros (1 PRIMARY + 2 SECONDARY).

## 🔍 Troubleshooting

### Erro: "ReplicaSetNoPrimary"
- Verifique se o replica set foi inicializado: `rs.status()`
- Verifique se o MongoDB está rodando: `docker ps | grep mongo`

### Erro: "getaddrinfo ENOTFOUND mongodb"
- Use `localhost` ao invés de `mongodb` quando conectar fora do Docker
- Dentro do Docker, use `mongodb` (hostname do serviço)

### Não consegue conectar
- Verifique se a porta está mapeada: `docker ps | grep 27017`
- Verifique firewall/localhost binding
- Teste: `mongosh mongodb://localhost:27017`

