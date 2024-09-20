import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
import { AuthGuard } from '../guard/authguard';

const authGuard = new AuthGuard();
const userController  = new UserController();
const userRoute = new Hono();


userRoute.post('/signup', userController.signUp);
userRoute.post('/signin', userController.signIn);
userRoute.get('/profile/:id', userController.getProfile);
userRoute.patch('/:id',userController.updateProfile)



export default userRoute;
