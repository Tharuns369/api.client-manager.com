import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middlewares/authMiddleware';


const userRoute = new Hono();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();


userRoute.post('/signup', userController.signUp);
userRoute.post('/signin', userController.signIn);
userRoute.get('/profile/:id', userController.getProfile);
userRoute.patch('/:id', userController.updateProfile);



export default userRoute;
