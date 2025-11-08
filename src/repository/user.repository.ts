import {IUser} from '@models/user.model';
import {GetDatabase} from '@database/database';


async function StoreUser(userdata: IUser) {
  const {collections} = await GetDatabase();

  return collections.users.insertOne(userdata);
}

async function VerifyUserExistsByEmail(_email: string) {
  const {collections} = await GetDatabase();
  console.log(collections);
  console.log(_email);

  return collections.users.countDocuments(
    {
      email: _email
    },
  );
}

export {
  StoreUser,
  VerifyUserExistsByEmail,
}

