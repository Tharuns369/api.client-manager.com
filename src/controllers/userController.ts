import bcrypt from 'bcryptjs';
import { Context } from "hono";
import { USER_MESSAGES } from "../constants/messaegConstants";
import { NotFoundException } from '../exceptions/notFoundException';
import { ResourceAlreadyExistsException } from "../exceptions/resourceAlreadyExistsException";
import { UnauthorisedException } from "../exceptions/unAuthorizedException";
import { AuthHelper } from "../helpers/authHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { UsersDataServiceProvider } from "../services/usersDataServiceProvider";


const usersDataServiceProvider = new UsersDataServiceProvider();
const authHelper = new AuthHelper();

export class UserController {

   async signUp(c: Context) {

    try {
      const userData = await c.req.json();

      const existedUser = await usersDataServiceProvider.findUserByEmail(userData.email);

      if (existedUser) {
        throw new ResourceAlreadyExistsException("email", USER_MESSAGES.USER_ALREADY_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      const data = await usersDataServiceProvider.insertUser(userData);

      const { password, ...rest } = data;

      return ResponseHelper.sendSuccessResponse(c, 200, USER_MESSAGES.USER_INSERTED_SUCCESS, rest);

    } catch (error) {
      console.log({ error });
      throw error;
    }
  }


  async signIn(c: Context) {
    try {
      const body = await c.req.json();

      const user = await usersDataServiceProvider.findUserByEmail(body.email);

      if (!user) {
        throw new UnauthorisedException(USER_MESSAGES.INVALID_CREDENTIALS);
      }

      const isPasswordMatch = await bcrypt.compare(body.password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorisedException(USER_MESSAGES.INVALID_CREDENTIALS);
      }

      const { token, refreshToken } = await authHelper.getUserAuthTokens(user);

      const { password, ...rest } = user;

      let response = {
        user_details: rest,
        access_token: token,
        refresh_token: refreshToken
      };

      return ResponseHelper.sendSuccessResponse(c, 200, USER_MESSAGES.LOGIN_SUCCESS, response);

    }

    catch (error) {
      throw error;
    }
  }


   async getProfile(c: Context) {
    try {
      const userId = +c.req.param('id');
      const userData: any = await usersDataServiceProvider.findUserById(userId);
      if (!userData) {
        throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
      }
      delete userData.password;

      return ResponseHelper.sendSuccessResponse(c, 200, USER_MESSAGES.USER_FETCHED_SUCCESS, userData);
    }
    catch (error) {
      throw error;
    }
  }

}