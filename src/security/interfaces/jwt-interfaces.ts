import jwt from 'jsonwebtoken';

export interface IPayload {
	id: string,
	name: String,
	email: string
}

/**
 * Interface for user payload data
 */
export interface UserPayloadCustom extends jwt.JwtPayload {
	id: string;
	email: string;
	name: string;
}