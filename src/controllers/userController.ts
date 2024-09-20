import bcrypt from 'bcryptjs';
import { Context } from "hono";
import { COMMON_VALIDATIONS, USER_MESSAGES } from "../constants/messaegConstants";
import { NotFoundException } from '../exceptions/notFoundException';
import { ResourceAlreadyExistsException } from "../exceptions/resourceAlreadyExistsException";
import { UnauthorisedException } from "../exceptions/unAuthorizedException";
import { AuthHelper } from "../helpers/authHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { UsersDataServiceProvider } from "../services/usersDataServiceProvider";
import { userSignInValidationSchema, userValidationDataInput } from '../validations/user/userSignInValidations';
import validate from '../helpers/validationHelper';
import { userSignUpValidationDataInput, userValidationSchema } from '../validations/user/userValidations';
import { updateprofilerValidationDataInput, updateUserValidationSchema } from '../validations/user/updateProfileValidation';



const usersDataServiceProvider = new UsersDataServiceProvider();
const authHelper = new AuthHelper();

export class UserController {

  async signUp(c: Context) {

    try {
      const userData = await c.req.json();

      const validatedData: userSignUpValidationDataInput = await validate(userValidationSchema, userData);

      const existedUser = await usersDataServiceProvider.findUserByEmail(validatedData.email);

      if (existedUser) {
        throw new ResourceAlreadyExistsException("email", USER_MESSAGES.USER_ALREADY_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      userData.password = hashedPassword;

      const data = await usersDataServiceProvider.insertUser(userData);

      const { password, ...rest } = data;

      return ResponseHelper.sendSuccessResponse(c, 200, USER_MESSAGES.USER_INSERTED_SUCCESS, rest);

    } catch (error) {
      throw error;
    }
  }


  async signIn(c: Context) {
    try {
      const body = await c.req.json();

      const validatedData: userValidationDataInput = await validate(userSignInValidationSchema, body);

      const user = await usersDataServiceProvider.findUserByEmail(validatedData.email);

      if (!user) {
        throw new UnauthorisedException(USER_MESSAGES.INVALID_CREDENTIALS);
      }

      const isPasswordMatch = await bcrypt.compare(validatedData.password, user.password);

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

  async updateProfile(c: Context) {
    try {
      const id = parseInt(c.req.param('id'), 10);
      if (isNaN(id)) {
        return ResponseHelper.sendErrorResponse(c, 400, COMMON_VALIDATIONS.INVALID_CLIENT_ID);
      }

      const body = await c.req.json();
      const validatedData: updateprofilerValidationDataInput = await validate(updateUserValidationSchema, body);

      const existingUser = await usersDataServiceProvider.getUser(id);
      if (!existingUser) {
        throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
      }

      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
      }

      const updatedUserData = {
        ...existingUser,
        ...validatedData
      };

      await usersDataServiceProvider.editUser(id, updatedUserData);

      return ResponseHelper.sendSuccessResponse(c, 200, USER_MESSAGES.USER_UPDATE_SUCCESS);

    } catch (error) {
      throw error;
    }
  }
}