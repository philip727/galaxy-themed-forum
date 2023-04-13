import { verifyJWTToken } from "../scripts/auth";
import handlePromise from "../scripts/promiseHandler";
import jwtDecode from 'jwt-decode'
import { IJWTPayload } from "../types/auth";
import { userExists } from "../scripts/users";
import { DEFAULT_COLUMNS } from "../config";

const passport = async (req: any, res: any, next: any) => {
    let [err, _] = await handlePromise<string>(verifyJWTToken(req.headers.authorization));
    if (err) {
        return res.send({
            success: false,
            response: "Failed to verify session token",
        });
    }

    const jwtPayload = jwtDecode(req.headers.authorization) as IJWTPayload;
    req.jwtPayload = jwtPayload;

    [err, _] = await handlePromise<string>(userExists(DEFAULT_COLUMNS, `uid = ${jwtPayload.uid}`)); 
    if (err) {
        return res.send({
            success: false,
            response: "Failed to verify session token",
        });
    }
    next();
}

export default passport;
