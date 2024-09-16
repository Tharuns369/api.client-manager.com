import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
import { UserValidationsMiddleWare } from '../middlewares/userMiddleware';

const userValidationsMiddleWare = new UserValidationsMiddleWare();

const userController  = new UserController();


const userRoute = new Hono();


userRoute.post('/signUp', userValidationsMiddleWare.validateEvent ,async (c) => await userController.userSignUp(c));
userRoute.post('/signIn', async (c) => await userController.userSignIn(c));
userRoute.get('profile', async (c) => await userController.getUserProfile(c));






export default userRoute;
