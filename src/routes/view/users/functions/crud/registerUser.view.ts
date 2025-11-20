import {Request, Response} from 'express';
import GetApiUrl from '@services/url.service';
import {IUser} from '@models/user.model';
import EncryptionUtils from '@utils/security/encryption-utils';
import {RoleManager, RoleSlug} from '@configs/roles/roles';
import UserRepository from '@repository/user.repository';
import {NormalizeEmail} from '@utils/normalizeEmail.utils';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, contacts } = req.body;

  if(!username || !email || !password || !contacts) {
    return res.status(422).send({
      message: 'Failed to register user, missing params',
      statusCode: 422,
      request: {
        method: 'POST',
        description: 'Try to register new user on application',
        url: `${GetApiUrl()}/users/register`
      }
    })
  }

  if(await UserRepository.VerifyUserExistsByEmail(email)) {
    return res.status(409).send({
      message: 'Failure to register new user',
      statusCode: 409,
      request: {
        method: 'POST',
        description: 'Try to register new user on application',
        url: `${GetApiUrl()}/users/register`
      }
    });
  }

  const passwordHash: string = await EncryptionUtils.CreateHashPassword(password);
  console.log(passwordHash);

  const roleSlugs: RoleSlug[] = ['USER'];
  const roleValue = RoleManager.getRolesBitfield(roleSlugs).toString();

  const user: IUser = {
    _username: username,
    _email: NormalizeEmail(email),
    _contacts: contacts,
    _roles: roleValue,
    _roleSlugs: roleSlugs,
    _password_hash: passwordHash,
    _created_at: new Date(),
  }

  await UserRepository.StoreUser(user);

  res.status(201).send({
    message: 'Successfully registered user',
    statusCode: 200,
    request: {
      method: 'POST',
      description: 'Try to register new user on application',
      url: `${GetApiUrl()}/users/register`
    }
  });
}
