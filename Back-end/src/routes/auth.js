import express from 'express';
import { authenticate } from '../util';
import { AuthController } from '../controllers';

const router = express.Router();
router.route('/login').post(AuthController.login);
router.route('/logout').post(authenticate, AuthController.logout);

export const Auth = { router, path: '/' };
