import {IUserPayload} from '@models/user.model';

class UserDTO {
  CreateUserPayload(_payloadData: IUserPayload){
    return {
      _id: _payloadData._id,
      _username: _payloadData._username,
      _email: _payloadData._email,
      _roles: _payloadData._roles,
      _roleSlugs: _payloadData._roleSlugs,
      _avatar: _payloadData._avatar,
    }
  }
}

export default new UserDTO();
