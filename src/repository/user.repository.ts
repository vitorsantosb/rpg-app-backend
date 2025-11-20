import {IUser} from '@models/user.model';
import {GetDatabase} from '@database/database';
import {ObjectId} from 'mongodb';



class UserRepository {
  async StoreUser(userdata: IUser) {
    const {collections} = await GetDatabase();

    return collections.users.insertOne(userdata);
  }

  async VerifyUserExistsByEmail(_email: string) {
    const {collections} = await GetDatabase();

    return collections.users.countDocuments(
      {
        _email: _email
      },
    );
  }

  async GetUserDataByEmail(_email: string) {
    const {collections} = await GetDatabase();

    return collections.users.findOne({
      _email: _email
    });
  }

  async UpdateUserPassword(_id: string, _newPassword: string) {
    const {collections} = await GetDatabase();
    const query = await collections.users.updateOne(
      {
        _id: new ObjectId(_id),
      },
      {
        $set: {
          _password_hash: _newPassword
        }
      }
    );

    console.log(query);

    return query;
  }
}

export default new UserRepository();
