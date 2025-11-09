import {Document, ObjectId} from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  _username: string;
  _email: string;
  _password_hash: string;
  _roles: string;
  _contacts?: ObjectId[]
  _created_at: Date;
  _updated_at?: Date;
  _deleted_at?: Date;
  _isDeleted?: boolean;
}

export interface IUserPayload {
  _id: ObjectId;
  _username: string;
  _email: string;
  _roles: string;
}
