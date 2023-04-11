import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../config';
import { IJWTPayload } from "../types/auth"
import { JWTError } from '../types/errors';

export const createJWTFromPayload = (payload: IJWTPayload): Promise<string | JWTError> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_KEY, { expiresIn: 7_890_000 }, (err, token) => {
            if (err) {
                return reject(JWTError.SIGNFAILED)
            }
            return resolve("Bearer " + token);
        })
    })
}

export const verifyJWTToken = (jwtToken: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const jwtTokenParsed = jwtToken.split("Bearer ")[1];
            jwt.verify(jwtTokenParsed, JWT_KEY);
            resolve(jwtToken)
        } catch (_) {
            reject(JWTError.VERIFICATIONFAILED)
        }
    })
}
