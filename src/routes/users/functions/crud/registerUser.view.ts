import {Request, Response} from 'express';
import GetApiUrl from '@utils/url.service';
import {IUser} from '@models/user.model';
import EncryptionUtils from '@utils/security/encryption-utils';
import {RoleManager} from '@configs/roles/roles';
import {StoreUser, VerifyUserExistsByEmail} from '@repository/user.repository';

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


  if(await VerifyUserExistsByEmail(email)) {
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

  const roleName = 'USER';
  const roleValue = RoleManager.getRoleValue(roleName).toString();

  const user: IUser = {
    _username: username,
    _email: email,
    _contacts: contacts,
    _roles: roleValue,
    _password_hash: passwordHash,
    _created_at: new Date(),
  }

  await StoreUser(user);

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
