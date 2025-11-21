import {Response, Request} from 'express';
import GetApiUrl from '@services/url.service';
import UserRepository from '@repository/user.repository';
import {UserAdapter} from '../../../../../adapters/user.adapter';

export const GetUserData = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if(!userId) {
    return res.status(401).send({
      message: 'User ID not found. Authentication required.',
      statusCode: 401,
      request: {
        method: 'GET',
        description: 'Try to get user data',
        url: `${GetApiUrl()}/user/me`
      }
    });
  }

  const userData = await UserRepository.GetUserDataById(userId);

  if(!userData) {
    return res.status(400).send({
      message: 'Failure to get user data',
      statusCode: 400,
      request: {
        method: 'GET',
        description: `Try to get user data`,
        url: `${GetApiUrl()}/user/me`
      }
    });
  }

  const _user = UserAdapter.userResponse(userData);

  return res.status(200).send({
    message: 'Successfully',
    statusCode: 200,
    request: {
      method: 'GET',
      description: 'Try to get user data',
      url: `${GetApiUrl()}/user/me`
    },
    user: _user
  })
}
