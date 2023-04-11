import express from 'express';
import { authControllerExports } from './../controllers/authController';
import { userControllerExports } from './../controllers/userController';


const router = express.Router();

router.post('/signup', authControllerExports.signUp);
router.post('/requestMailVerificationCode', authControllerExports.requestMailVerificationCode);

//these should be protected routes
router.get('/', userControllerExports.getUser);


export const userRoutesExports = {
    router: router,
};