import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
import { UserValidationsMiddleWare } from '../middlewares/userMiddleware';
import { AuthGuard } from '../guard/authguard';

const authGuard = new AuthGuard();
const userValidationsMiddleWare = new UserValidationsMiddleWare();
const userController  = new UserController();
const userRoute = new Hono();


userRoute.post('/signUp', userValidationsMiddleWare.validateEvent ,async (c) => await userController.userSignUp(c));
userRoute.post('/signIn', userValidationsMiddleWare.validateSignIn, async (c) => await userController.userSignIn(c));
userRoute.get('/profile', authGuard.authGuard, async (c) => await userController.getUserProfile(c));






export default userRoute;
