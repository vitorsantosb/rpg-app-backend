import bcryptjs from 'bcryptjs';
import {ApiLogMessage, ErrorLogMessage, WarningLogMessage} from "@configs/logs/logMessages";

export async function VerifyHashPassword(_password: string, _passwordToCompare: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		bcryptjs.compare(_password, _passwordToCompare, (err, result) => {
			if (err) {
				reject(err);
			}
			if (!result) {
				WarningLogMessage('[SECURITY]', 'Wrong user password');
				reject(false);
			}
			if (result) {
				resolve(true);
			}
		})
	})
}

export async function CreateHashPassword(_password: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
		bcryptjs.genSalt(saltRounds, async function(err, salt) {
			if (err) {
				ErrorLogMessage('[SECURITY]', 'Failure to generate salt for password');
				reject(err);
				return;
			}
			
			if (!salt) {
				ErrorLogMessage('[SECURITY]', 'Salt is undefined');
				reject(new Error('Failed to generate salt'));
				return;
			}
			
			bcryptjs.hash(_password, salt, async function (err, hash) {
				if (err) {
					ErrorLogMessage('[SECURITY]', 'Failure to generate hash for user password');
					reject(err);
					return;
				}
				if (!hash) {
					ErrorLogMessage('[SECURITY]', 'Hash is undefined');
					reject(new Error('Failed to generate hash'));
					return;
				}
				resolve(hash);
			});
		})
	})
}
