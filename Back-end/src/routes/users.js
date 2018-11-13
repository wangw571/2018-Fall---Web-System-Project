import express from 'express';
import { authenticate } from '../util';
import { UsersController } from '../controllers';

const router = express.Router();
router.use(authenticate);

router.route('/').get(UsersController.getAllUsers);
router.route('/me')
  .get(UsersController.getMe)
  .post(UsersController.postMe)
;

router.route('/:org')
  .get(UsersController.getOrgUsers)
  .post(UsersController.postOrgUser)
;

router.route('/:org/:user')
  .get(UsersController.getUser)
  .post(UsersController.postUser)
  .delete(UsersController.deleteUser)
;

export const Users = { router, path: '/users' };