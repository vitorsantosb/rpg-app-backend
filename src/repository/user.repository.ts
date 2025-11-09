import {IUser} from '@models/user.model';
import {GetDatabase} from '@database/database';



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
}

export default new UserRepository();
