import { Context } from "hono";
import { UserServices } from "../services/userServices";
import { USER_VALIDATIONS,COMMON_VALIDATIONS } from "../constants/messaegConstants";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!;
const JWT_ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;
const JWT_REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!;

const userServices = new UserServices();

export class UserController{

   async userSignUp(c:Context){

    try {
      const userData = await c.req.json();

      const existedUser = await userServices.findUser(userData.email);

      if (existedUser) {
          return c.json({
              status: false,
              message: USER_VALIDATIONS.USER_ALREADY_EXISTS,
          }, 400);
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      const insertedUser = await userServices.insertUser(userData);

      return c.json({
          status: true,
          message: USER_VALIDATIONS.USER_INSERTED_SUCCESS,
          data: insertedUser,
      });
  } catch (error) {
      console.error('Error Insert User:', error);
      return c.json({
          status: 'Error',
          message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
      }, 500);
  }
   } 


   async userSignIn(c: Context) {
    try {
      const { email, password } = await c.req.json();

      const user = await userServices.findUser(email);

      if (!user) {
          return c.json({
              status: false,
              message: USER_VALIDATIONS.USER_NOT_FOUND,
          }, 404);
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);


      if (!isPasswordMatch) {
          return c.json({
              status: false,
              message: USER_VALIDATIONS.INVALID_PASSWORD,
          }, 401);
      }

      const accessToken = jwt.sign({ email: user.email }, process.env.JWT_ACCESS_TOKEN_SECRET!, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN });
      const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_REFRESH_TOKEN_SECRET!, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN });
      return c.json({
          status: true,
          message: USER_VALIDATIONS.LOGIN_SUCCESS,
          data:user,
          Accession_token : accessToken,refresh_token: refreshToken 
      });
  } catch (error) {
      console.error('Error Sign-In User:', error);
      return c.json({
          status: 'Error',
          message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
      }, 500);
    }
  }
     

  async getUserProfile(c: Context) {
    try {
        const email = c.req.query('email');
        if (!email) {
            return c.json({
                status: false,
                message: USER_VALIDATIONS.EMAIL_REQUIRED,
            }, 400);
        }

        const user = await userServices.findUser(email);

        if (user) {
            return c.json({
                status: true,
                message: USER_VALIDATIONS.USER_FETCHED_SUCCESS,
                data: user, 
            }, 200);
        }

        return c.json({
            status: false,
            message: USER_VALIDATIONS.USER_NOT_FOUND,
            data: null,
        }, 404);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return c.json({
            status: 'Error',
            message: COMMON_VALIDATIONS.SOMETHING_WENT_WRONG,
        }, 500);
    }
}


  
}
