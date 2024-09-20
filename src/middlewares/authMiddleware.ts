import { Context, Next } from "hono";
import { decode, verify } from 'hono/jwt';

import { UsersDataServiceProvider } from "../services/usersDataServiceProvider";
import { UnauthorisedException } from "../exceptions/unAuthorizedException";
import { ForbiddenException } from "../exceptions/forBiddenException";
import { BadRequestException } from "../exceptions/badRequestException";
import { ConfigData } from "../config/appConfig";

const userDataServiceProvider = new UsersDataServiceProvider();

export class AuthMiddleware {

    public async checkAndValidateAuthToken(c: Context, next: Next) {
        try {
            const authHeader = c.req.header("authorization");

            if (!authHeader) {
                throw new UnauthorisedException("No Authorization Token");
            }

            const token = authHeader;

            // Decode token
            const decodedToken: any = decode(token);

            if (!decodedToken) {
                throw new ForbiddenException('Invalid Token');
            }

            // Find user by decoded token ID
            const user = await userDataServiceProvider.findUserById(decodedToken.payload.id);

            if (!user) {
                throw new ForbiddenException('User not found');
            }

            // Verify the token using the secret key (with user's password)
            const secret = ConfigData.JWT.token_secret + user.password;

            await verify(token, secret);

            // Attach user to the context
            c.set("user", user);

            // Proceed to the next middleware/route handler
            await next();
        } catch (error: any) {
            // Handle different types of exceptions
            if (error instanceof ForbiddenException || error instanceof UnauthorisedException) {
                throw error;
            }
            if (error.name === 'JwtTokenExpired') {
                // Handle invalid signature exception here
                throw new UnauthorisedException('Token expired');
            } else {
                throw new BadRequestException("Something went wrong with the authentication process.");
            }
        }
    }
}
