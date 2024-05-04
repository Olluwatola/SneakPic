import express from 'express';
import { authControllerExports } from './../controllers/authController';
import { userControllerExports } from './../controllers/userController';
import { userHandlerExports } from '../handlers/userHandlers';

const router = express.Router();

router.post('/signup', authControllerExports.signUp);
router.post('/login', authControllerExports.login);
router.get('/requestmvc', authControllerExports.requestMailVerificationCode);

//protected routes
router.use(userHandlerExports.protect);

router.get('/:id', userControllerExports.getUser);
router.get('/', userControllerExports.getAllUsers);

export const userRoutesExports = {
    router: router,
};
