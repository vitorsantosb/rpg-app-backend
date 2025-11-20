import {Request, Response} from 'express';
import {userViewerFunctions} from '@routes/view/users/functions/functions';

export const userController = {
  register: (req: Request, res: Response) => {
    return userViewerFunctions.registerUser(req, res);
  },
  login: (req: Request, res: Response) => {
    return userViewerFunctions.userLogin(req, res);
  }
};

