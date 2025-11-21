import {IUser} from '@models/user.model';

export const UserAdapter = {
  userResponse: (user: IUser) => {
    return {
      _id: user._id,
      _username: user._username,
      _email: user._email,
      _roleSlugs: user._roleSlugs,
      _roles: user._roles,
      _avatar: user._avatar,
    }
  }
}
