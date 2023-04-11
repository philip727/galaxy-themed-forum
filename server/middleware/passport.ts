import { verifyJWTToken } from "../scripts/auth";
import handlePromise from "../scripts/promiseHandler";
import jwtDecode from 'jwt-decode'

const passport = async (req: any, res: any, next: any) => {
    const [err, _] = await handlePromise<string>(verifyJWTToken(req.headers.authorization));
    if (err) {
        return res.send({
            success: false,
            response: "Failed to verify session token",
        });
    }
    req.jwtPayload = jwtDecode(req.headers.authorization);

    next();
}

export default passport;
