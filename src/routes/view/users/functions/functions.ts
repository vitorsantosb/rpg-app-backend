import {registerUser} from '@routes/view/users/functions/crud/registerUser.view';
import {userLogin} from '@routes/view/users/functions/crud/login.view';
import {GetUserData} from '@routes/view/users/functions/crud/getUserData.view';

export const userViewerFunctions = {
  registerUser,
  userLogin,
  GetUserData
};
