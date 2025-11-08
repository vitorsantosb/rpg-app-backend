import jwt from 'jsonwebtoken';
import {IPayload, UserPayloadCustom} from '@security/interfaces/jwt-interfaces';
import GetApiUrl from '@utils/url.service';
import {Request, Response} from 'express';

const jwt_secret_token = process.env.JWT_TOKEN_SECRET;



async function CreateUserAccessToken(payload: IPayload) {
	if(!jwt_secret_token){
		throw new Error('Missing JWT_TOKEN_SECRET');
	}
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			jwt_secret_token, {
				expiresIn: '24h'
			},
			(err, token) => {
				if (err) {
					return reject(err);
				}
				return resolve(token);
			}
		)
	})
}

async function VerifyAuthUserAccessToken(req: Request, res: Response) {
	const token = req.cookies.authToken;

	if (!token) {
		throw new Error('[JWT_GUARD] Token not found');
	}
	if(!jwt_secret_token){
		throw new Error('Missing JWT_TOKEN_SECRET');
	}
	return new Promise((resolve, reject) => {
		try {
			jwt.verify(token, jwt_secret_token, (err: any) => {
				if (err) {
					res.status(403).send({
						message: 'Unauthorized',
						statusCode: 403,
						request: {
							method: 'POST',
							description: 'Token is expired or invalid!',
							URL: `${GetApiUrl()}/auth`,
						},
					});
					return resolve(false)
				} else {
					resolve(true)
				}
			})
		} catch (err) {
			return reject(err);
		}
	})
}


function DecodedUserJwtPayload(_payload: string): IPayload {
	if(!jwt_secret_token){
		throw new Error('Missing JWT_TOKEN_SECRET');
	}
	const _payloadDecoded = jwt.verify(_payload, jwt_secret_token) as UserPayloadCustom;

	return {
		id: _payloadDecoded.id,
		name: _payloadDecoded.name,
		email: _payloadDecoded.email,
	}
}


export {
	CreateUserAccessToken,
	VerifyAuthUserAccessToken,
	DecodedUserJwtPayload,
}

