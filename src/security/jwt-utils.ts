import jwt from 'jsonwebtoken';
import {IPayload, UserPayloadCustom} from '@security/interfaces/jwt-interfaces';
import GetApiUrl from '@services/url.service';
import {Request, Response} from 'express';

const jwt_secret_token = process.env.JWT_TOKEN_SECRET;

class JwtUtils {
	async CreateUserAccessToken(payload: IPayload) {
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

	async VerifyAuthUserAccessToken(req: Request, res: Response) {
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

	DecodedUserJwtPayload(_payload: string): IPayload {
		if(!jwt_secret_token){
			throw new Error('Missing JWT_TOKEN_SECRET');
		}
		const _payloadDecoded = jwt.verify(_payload, jwt_secret_token) as UserPayloadCustom;

		return {
			_id: _payloadDecoded._id,
			_username: _payloadDecoded._username,
			_email: _payloadDecoded._email,
			_roles: _payloadDecoded._roles,
      _roleSlugs: _payloadDecoded._roleSlugs,
		}
	}

}

export default new JwtUtils();

