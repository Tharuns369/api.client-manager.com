import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
const userController = new UserController();
const userRoute = new Hono();
userRoute.post('/signup', userController.signUp);
userRoute.post('/signin', userController.signIn);
userRoute.get('/profile/:id', userController.getProfile);
export default userRoute;
