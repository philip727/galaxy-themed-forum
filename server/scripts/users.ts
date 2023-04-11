import { db } from "../index"
import { RegisterData } from "../types/users";
import bcrypt from 'bcrypt'
import handlePromise from "./promiseHandler";

const BCRYPT_SALT_ROUNDS = 12;

export const tryCreateNewUser = (data: RegisterData): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS, async (bcryptErr, hash) => {
            if (bcryptErr) {
                return reject("Server Error (TCNUBCH)");
            }


            // Inserts into DB with hashed password
            const [err, _] = await handlePromise<Array<any>>(
                db.query(`INSERT INTO users (name, email, password, role) VALUES (\"${data.username}\", \"${data.email}\", \"${hash}\", \"user\")`));

            if (err) {
                return reject("Server Error (TCNU)");
            }

            console.log(`Created new user ${data.username} / ${hash} / ${data.email}`);

            resolve(data as unknown as string);
        })
    })
}
