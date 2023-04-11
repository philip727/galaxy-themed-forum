import { verifyJWTToken } from "../scripts/auth";
import handlePromise from "../scripts/promiseHandler";
import jwtDecode from 'jwt-decode'

export const passport = async (req: any, res: any, next: any) => {
    const [err, result] = await handlePromise<string>(verifyJWTToken(req.headers.authorization));
    if (err) {
        console.log("yes");
        return res.send({
            success: false,
            response: "Failed to verify session token",
        });
    }
    req.jwtPayload = jwtDecode(req.headers.authorization);

    next();
}
