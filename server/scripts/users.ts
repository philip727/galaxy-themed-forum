import { db } from "../index"
import { RegisterData } from "../types/users";
import bcrypt from 'bcrypt'
import handlePromise from "./promiseHandler";

const BCRYPT_SALT_ROUNDS = 12;

export const tryCheckIfUserDoesNotExistByName = (username: string, columns: string[]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<string>(db.query(`SELECT ${columns.toString()} FROM users WHERE name LIKE \"${username}\";`));
        if (err) {
            return reject("Server Error (TDUEFN)");
        }

        // If the array is empty, then the user does not exist
        if (!Array.isArray(result) || result.length == 0) {
            return resolve("User does not exist");
        }

        return reject(result);
    })
}

export const tryCheckIfUserDoesNotExistByEmail = (email: string, columns: string[]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<string>(db.query(`SELECT ${columns.toString()} FROM users WHERE email LIKE \"${email}\";`));
        if (err) {
            return reject("Server Error (TDUEFM)");
        }

        // If the array is empty, then the user does not exist
        if (!Array.isArray(result) || result.length == 0) {
            return resolve("User does not exist");
        }

        return reject(result);
    })
}

export const tryCreateNewUser = (data: RegisterData): Promise<string> => {
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

            resolve(data as unknown as string);
        })
    })
}

export const tryCheckIfUserExistsByName = (username: string, columns: string[]): Promise<object | string> => {
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

        resolve(data[0]);
    })
}


export const tryGrabUserByUID = (uid: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const [err, data] = await handlePromise<string>(db.query(`SELECT name, uid, role, regdate FROM users WHERE uid = ${uid};`));
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

export const tryGrabLastUser = (): Promise<object | string> => {
    return new Promise(async (resolve, reject) => {
        const [err, data] = await handlePromise<object>(db.query('SELECT name, uid, role, regdate FROM users ORDER BY UID DESC LIMIT 1'));
        if (err || (Array.isArray(data) && data.length == 0)) {
            return reject("Server Error (STGLU)");
        }

        // @ts-ignore 
        return resolve(data[0]);
    })
}

export const getUserRole = (uid: number): Promise <object | string> => {
    return new Promise(async (resolve, reject) => {
        const [err, data] = await handlePromise<object>(db.query(`SELECT role FROM users WHERE uid = ${uid};`));   
        if (err) {
            return reject("Server Error (STGUR)");
        }

        if (!Array.isArray(data) || data.length > 1) {
            return reject(`No user with the uid ${uid}`);
        }

        return resolve(data[0])
    })
}
