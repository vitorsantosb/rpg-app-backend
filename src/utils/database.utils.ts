import {ObjectId} from 'mongodb';
import EncryptionUtils from '@utils/security/encryption-utils';
import UserRepository from '@repository/user.repository';
import {ApiLogMessage} from '@configs/logs/logMessages';

export async function ForceUpdateUserPassword(_userId: string, _password: string)  {
  const hashPassword = await EncryptionUtils.CreateHashPassword(_password);

  await UserRepository.UpdateUserPassword(_userId, hashPassword);
  ApiLogMessage('[DATABASE_FORCE_UPDATE]', `Successfully updated user with id ${_userId}`);
}
