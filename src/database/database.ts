import {MongoClient, Collection, Db, Document} from 'mongodb';
import {IUser} from '@models/user.model';

require('dotenv').config();

const url: string = process.env.MONGO_URI!;
const client = new MongoClient(url);

interface IDatabase {
  db: Db | null;
  connection: MongoClient | null;
  collections: ICollections | null;
}

/**
 * @type {{collections: {[collection: string]: Collection}, connection: null, db: null}}
 */
const database: IDatabase = {
  db: null,
  connection: null,
  collections: null,
};

interface ICollections {
  users: Collection<IUser>;
  api: Collection<Document>;
  system_roles: Collection<Document>;
}

async function mountCollections(db: Db): Promise<ICollections> {
  return {
    users: db.collection('users'),
    api: db.collection('api'),
    system_roles: db.collection('system_roles'),
  };
}

type IDatabaseWithCollections = IDatabase & { collections: ICollections };

export async function GetDatabase(): Promise<IDatabaseWithCollections> {
  if (!database.connection) {
    database.connection = await client.connect();
    database.db = client.db('rpg-app');
    database.collections = await mountCollections(database.db);
  }
  return database as IDatabaseWithCollections;
}

export default { GetDatabase };
