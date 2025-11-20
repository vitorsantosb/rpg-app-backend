import EncryptionUtils from '@utils/security/encryption-utils';
import UserRepository from '@repository/user.repository';
import {NormalizeEmail} from '@utils/normalizeEmail.utils';
import GetApiUrl from '@services/url.service';
import {Request, Response} from 'express';
import UserDto from '@models/dto/user.dto';
import JwtUtils from '@security/jwt-utils';
import {RoleManager} from '@configs/roles/roles';

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send({
      message: 'Email or password is invalid',
      statusCode: 401,
      request: {
        method: 'POST',
        description: 'Try to login with user credentials',
        url: `${GetApiUrl()}/user/login`
      }
    });
  }

  const normalizedEmail = NormalizeEmail(email.toString());
  const user = await UserRepository.GetUserDataByEmail(normalizedEmail);

  if (!user || !user._id) {
    return res.status(404).send({
      message: 'Authentication failure',
      statusCode: 404,
      request: {
        method: 'POST',
        description: `Try to login with current credentials, user authentication failure`,
        url: `${GetApiUrl()}/user/login`
      }
    });
  }

  try {
    await EncryptionUtils.VerifyHashPassword(password.toString(), user._password_hash);
  } catch (err) {
    return res.status(401).send({
      message: 'Authentication failure, email or password is invalid',
      statusCode: 401,
      errorMessage: err instanceof Error ? err.message : String(err),
      request: {
        method: 'POST',
        description: 'Try to login with user credentials',
        url: `${GetApiUrl()}/user/login`
      }
    });
  }

  const roleSlugs = user._roleSlugs && user._roleSlugs.length > 0
    ? user._roleSlugs
    : RoleManager.getRoleNamesFromBitfield(user._roles);

  const payload = UserDto.CreateUserPayload({
    _id: user._id,
    _username: user._username,
    _email: user._email,
    _roles: user._roles,
    _roleSlugs: roleSlugs,
  });

  console.log(payload);

  try {
    const token = await JwtUtils.CreateUserAccessToken(payload);

    if(token){
      return res.status(200).send({
        message: 'Successfully',
        statusCode: 200,
        request: {
          method: 'POST',
          description: 'Successfully login with user credentials',
          url: `${GetApiUrl()}/user/login`,
          token: token,
        },
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: 'Failure',
      statusCode: 500,
      request: {
        method: 'POST',
        description: 'Failed to login with user credentials',
        url: `${GetApiUrl()}/user/login`,
        error: error instanceof Error ? error.message : String(error),
      }
    });
  }
};
