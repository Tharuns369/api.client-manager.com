export class AuthGuard {
    async authGuard(c, next) {
        try {
            const authorization = c.req.header('authorization');
            if (!authorization || authorization.trim() === '') {
                return c.json({ status: false, message: 'Please provide Authorization' }, 401);
            }
            const authToken = authorization.replace(/bearer/gim, '').trim();
            const apiToken = process.env.API_TOKEN;
            if (authToken !== apiToken) {
                return c.json({ status: false, message: 'Invalid API Token' }, 401);
            }
            await next();
        }
        catch (error) {
            console.error('Auth error - ', error);
            return c.json({ status: false, message: error || 'Session expired! Please sign in' }, 403);
        }
    }
}
