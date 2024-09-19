import { sign } from 'hono/jwt';
import { ConfigData } from "../config/appConfig";
import { User } from '../schemas/users';


export class AuthHelper {

    async getUserAuthTokens(userData: User) {

        const commonPayload = {
            id: userData.id,
            email: userData.email,
            user_type: userData.user_type,
            first_name: userData.first_name,
            last_name: userData.last_name,
        };

        const payloadForAccessToken = { ...commonPayload, exp: ConfigData.JWT.token_life };
        const payloadForRefreshToken = { ...commonPayload, exp: ConfigData.JWT.refresh_token_life };

        let tokenSecret = ConfigData.JWT.token_secret + userData.password;
        let refreshTokenSecret = ConfigData.JWT.refresh_token_secret + userData.password;

        const token = await sign(payloadForAccessToken, tokenSecret);

        const refreshToken = await sign(payloadForRefreshToken, refreshTokenSecret);
        return {
            token,
            refreshToken,
        };
    };
}