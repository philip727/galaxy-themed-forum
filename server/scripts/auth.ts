import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../config';
import { IJWTPayload, IJWTToken } from "../types/auth"

export const createJWTFromPayload = (payload: IJWTPayload): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_KEY, { expiresIn: 7_890_000 }, (err, token) => {
            if (err) {
                return reject("Server Error (SLJK)")
            }
            return resolve("Bearer " + token);
        })
    })
}

export const verifyJWTToken = (jwtToken: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const jwtTokenParsed = jwtToken.split("Bearer ")[1];
            const _ = jwt.verify(jwtTokenParsed, JWT_KEY)
            resolve(jwtToken)
        } catch (_) {
            reject("Failed to verify session token")
        }
    })
}
