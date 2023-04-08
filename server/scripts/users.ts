import { db } from "../index"
import { IQueryData, RegisterData } from "../types/users";
import bcrypt from 'bcrypt'
import handlePromise from "./promiseHandler";

const BCRYPT_SALT_ROUNDS = 12;

export const tryCheckIfUserDoesNotExistByName = (username: string, columns: string[]): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<string>(db.query(`SELECT ${columns.toString()} FROM users WHERE name LIKE \"${username}\";`));
        if (err) {
            return reject("Server Error (TDUEFN)");
        }

        // If the array is empty, then the user does not exist
        if (!Array.isArray(result) || result.length == 0) {
            return resolve("User does not exist");
        }

        return reject({ response: result });
    })
}

export const tryCheckIfUserDoesNotExistByEmail = (email: string, columns: string[]): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<string>(db.query(`SELECT ${columns.toString()} FROM users WHERE email LIKE \"${email}\";`));
        if (err) {
            return reject("Server Error (TDUEFM)");
        }

        // If the array is empty, then the user does not exist
        if (!Array.isArray(result) || result.length == 0) {
            return resolve("User does not exist");
        }

        return reject({ response: result });
    })
}

export const tryCreateNewUser = (data: RegisterData): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS, async (bcryptErr, hash) => {
            if (bcryptErr) {
                return reject("Server Error (TCNUBCH)");
            }


            // Inserts into DB with hashed password
            const [err, _] = await handlePromise<string>(
                db.query(`INSERT INTO users (name, email, password, role) VALUES (\"${data.username}\", \"${data.email}\", \"${hash}\", \"user\")`));

            if (err) {
                return reject("Server Error (TCNU)");
            }

            console.log(`Created new user ${data.username} / ${hash} / ${data.email}`);

            resolve({ response: data });
        })
    })
}

export const tryCheckIfUserExistsByName = (username: string, columns: string[]): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        const [err, data] = await handlePromise<string>(db.query(`SELECT ${columns.toString()} FROM users WHERE name LIKE \"${username}\";`));
        if (err) {
            return reject("Server Error (TDUEFN)");
        }

        // If the array is empty, then the user does not exist
        if (!Array.isArray(data) || data.length == 0) {
            return reject("User does not exist");
        }

        if (Array.length > 1) {
            return reject(`There are ${Array.length} users with this name, please contact the site admin`);
        }

        resolve({ response: data[0] });
    })
}


export const tryGrabUserByUID = (uid: number): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const [err, data] = await handlePromise<string>(db.query(`SELECT name, uid, role FROM users WHERE uid = ${uid};`));
        if (err) {
            return reject(`No user with the uid: ${uid} exists`);
        }

        // If the array is empty, then the user uid hasn't been created
        if (Array.isArray(data) && data.length == 0) {
            return reject(`No user with the uid: ${uid} exists`);
        }

        // Returns the data assosciated with the uid
        return resolve(data as string);
    })
}
