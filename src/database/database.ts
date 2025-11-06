import mongoose, { Connection, ClientSession } from 'mongoose';
require('dotenv').config();

// Helper para construir URI com credenciais
const buildConnectionString = (
  host: string,
  port: string | number,
  database: string,
  options: string,
  username?: string,
  password?: string,
  authSource: string = 'admin'
): string => {
  const auth = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : '';
  return `mongodb://${auth}${host}:${port}/${database}?${options}${auth ? `&authSource=${authSource}` : ''}`;
};

// Configurações para diferentes tipos de operações
const getConnectionString = (type = 'primary'): string => {
  // PRIORIDADE 1: Se URI completa for fornecida via env (Railway, MongoDB Atlas, etc)
  // Railway geralmente fornece MONGO_URI ou MONGODB_URI
  if (type === 'read' && process.env.MONGO_READ_URI) {
    return process.env.MONGO_READ_URI;
  }
  if (type === 'write' && process.env.MONGO_WRITE_URI) {
    return process.env.MONGO_WRITE_URI;
  }
  if (type === 'primary' && (process.env.MONGO_URI || process.env.MONGODB_URI)) {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    // Se for Railway/Atlas, já vem com replicaSet configurado na URI
    return uri as string;
  }

  // PRIORIDADE 2: Constrói URI a partir de variáveis separadas (local ou customizado)
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const host = process.env.MONGODB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT || '27017';
  const database = process.env.MONGODB_DATABASE || 'rpg-database';
  const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin';

  // Se usar MongoDB local simples (sem replica set), não adiciona replicaSet
  const useReplicaSet = process.env.MONGODB_USE_REPLICA_SET !== 'false';
  const replicaSet = process.env.MONGODB_REPLICA_SET || 'rs0';
  const baseOptions = useReplicaSet ? `replicaSet=${replicaSet}` : '';
  
  if (type === 'read') {
    const options = baseOptions ? `${baseOptions}&readPreference=secondaryPreferred` : 'readPreference=secondaryPreferred';
    return buildConnectionString(host, port, database, options, username, password, authSource);
  }

  if (type === 'write') {
    const options = baseOptions ? `${baseOptions}&readPreference=primary` : 'readPreference=primary';
    return buildConnectionString(host, port, database, options, username, password, authSource);
  }

  // Conexão completa (fallback)
  return buildConnectionString(host, port, database, baseOptions, username, password, authSource);
};

// Configurações otimizadas para diferentes tipos de operações
const getConnectionOptions = (type = 'primary'): mongoose.ConnectOptions => {
  const baseOptions: mongoose.ConnectOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  switch (type) {
    case 'read':
      return {
        ...baseOptions,
        readPreference: 'secondaryPreferred',
        maxPoolSize: 5,
      };

    case 'write':
      return {
        ...baseOptions,
        readPreference: 'primary',
        maxPoolSize: 3,
      };

    default:
      return {
        ...baseOptions,
        readPreference: 'primary',
      };
  }
};

// Conexões separadas para diferentes operações
const connections = {
  read: null as Connection | null,
  write: null as Connection | null,
  primary: null as Connection | null,
};

// Função para obter ou criar conexão de leitura
async function GetReadConnection(): Promise<Connection> {
  if (!connections.read || connections.read.readyState !== 1) {
    const uri = getConnectionString('read');
    connections.read = mongoose.createConnection(uri, getConnectionOptions('read'));
    await connections.read.asPromise();
  }
  return connections.read;
}

// Função para obter ou criar conexão de escrita
async function GetWriteConnection(): Promise<Connection> {
  if (!connections.write || connections.write.readyState !== 1) {
    const uri = getConnectionString('write');
    connections.write = mongoose.createConnection(uri, getConnectionOptions('write'));
    await connections.write.asPromise();
  }
  return connections.write;
}

// Função principal (mantém compatibilidade)
async function GetDatabase(): Promise<Connection> {
  if (!connections.primary || connections.primary.readyState !== 1) {
    const uri = getConnectionString('primary');
    connections.primary = mongoose.createConnection(uri, getConnectionOptions('primary'));
    await connections.primary.asPromise();
  }
  return connections.primary;
}

// Função para iniciar uma transação
async function StartTransaction(): Promise<ClientSession> {
  const connection = await GetWriteConnection();
  const session = await connection.startSession();
  session.startTransaction();
  return session;
}

// Função para executar uma operação dentro de uma transação
async function WithTransaction<T>(
  callback: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = await StartTransaction();
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

// Função para fechar todas as conexões
async function CloseAllConnections(): Promise<void> {
  await Promise.all([
    connections.read?.close(),
    connections.write?.close(),
    connections.primary?.close(),
  ]);
  connections.read = null;
  connections.write = null;
  connections.primary = null;
}

export {
  GetDatabase,
  GetReadConnection,
  GetWriteConnection,
  StartTransaction,
  WithTransaction,
  CloseAllConnections,
};
