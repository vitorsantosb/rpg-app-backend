import jwt from 'jsonwebtoken';
import {ObjectId} from 'mongodb';

export interface IPayload {
	_id: ObjectId,
	_username: string,
	_roles: string,
	_email: string
}

/**
 * Interface for user payload data
 */
export interface UserPayloadCustom extends jwt.JwtPayload {
	_id: ObjectId;
	_email: string;
	_username: string;
	_roles: string;
}
