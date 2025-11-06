# 🚂 Configuração MongoDB no Railway

## Passo a Passo

### 1. Criar MongoDB no Railway

1. Acesse [Railway.app](https://railway.app)
2. Crie um novo projeto
3. Adicione um serviço "MongoDB"
4. Railway vai criar automaticamente com:
   - Replica Set configurado
   - Autenticação habilitada
   - URI de conexão pronta

### 2. Copiar URI de Conexão

1. No Railway, acesse o serviço MongoDB
2. Vá na aba "Variables" ou "Connect"
3. Copie a variável `MONGO_URL` ou `MONGODB_URL`

A URI geralmente tem este formato:
```
mongodb://mongo:password@containers-us-west-xxx.railway.app:27017/railway?authSource=admin
```

### 3. Configurar no .env

No seu arquivo `.env`, adicione:

```env
# Railway MongoDB (já vem com replica set)
MONGO_URI=mongodb://mongo:password@containers-us-west-xxx.railway.app:27017/railway?authSource=admin
```

OU use a variável que o Railway fornece:

```env
MONGO_URI=${MONGO_URL}
```

### 4. Pronto! 🎉

O código vai detectar automaticamente a URI e usar:
- ✅ Replica Set configurado
- ✅ Autenticação habilitada
- ✅ Conexões de leitura/escrita otimizadas

## Vantagens do Railway

- ✅ Replica Set já configurado
- ✅ Sem necessidade de Docker local
- ✅ Backup automático
- ✅ Escalável
- ✅ Monitoramento incluído

## Transações

O Railway MongoDB já vem com replica set, então transações funcionam automaticamente!

```typescript
import { WithTransaction } from '@database/database';

const result = await WithTransaction(async (session) => {
  // Suas operações aqui
});
```

## Notas

- A URI do Railway já inclui todas as configurações necessárias
- Não precisa configurar `MONGO_WRITE_URI` ou `MONGO_READ_URI` separadamente
- O código detecta automaticamente se é Railway/Atlas pela URI completa
