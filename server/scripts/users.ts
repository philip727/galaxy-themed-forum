import { db } from "../index"
import { IQueryData, RegisterData } from "../types/users";
import bcrypt from 'bcrypt'

const BCRYPT_SALT_ROUNDS = 12;

export const tryCheckIfUserDoesNotExistByName = (username: string, columns: string[]): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        await db.query(`SELECT ${columns.toString()} FROM users WHERE name LIKE \"${username}\";`)
            .then(result => {
                // If the array is empty, then the user does not exist
                if (!Array.isArray(result) || result.length == 0) {
                    return resolve("");
                }

                return reject({ response: result });
            })
            .catch(_ => reject("Server Error (TDUEFN)"));
    })
}

export const tryCheckIfUserDoesNotExistByEmail = (email: string, columns: string[]): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        await db.query(`SELECT ${columns.toString()} FROM users WHERE email LIKE \"${email}\";`)
            .then(result => {
                // If the array is empty, then the user does not exist
                if (!Array.isArray(result) || result.length == 0) {
                    return resolve("");
                }

                return reject({ response: result });
            })
            .catch(_ => reject("Server Error (TDUEFM)"));
    })
}

export const tryCreateNewUser = (data: RegisterData): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS, async (err, hash) => {
            if (err) {
                return reject("Server Error (TCNUBCH)");
            }
            // Inserts into DB with hashed password
            await db.query(`INSERT INTO users (name, email, password, role) VALUES (\"${data.username}\", \"${data.email}\", \"${hash}\", \"user\")`)
                .then(_ => {
                    console.log(`Created new user ${data.username} / ${hash} / ${data.email}`);

                    resolve({ response: data });
                })
                .catch(_ => reject("Server Error (TCNU)"));
        })
    })
}

export const tryCheckIfUserExistsByName = (username: string, columns: string[]): Promise<IQueryData | string> => {
    return new Promise(async (resolve, reject) => {
        await db.query(`SELECT ${columns.toString()} FROM users WHERE name LIKE \"${username}\";`)
            .then(result => {
                // If the array is empty, then the user does not exist
                if (!Array.isArray(result) || result.length == 0) {
                    return reject("");
                }

                if (Array.length > 1) {
                    return reject(`There are ${Array.length} users with this name, please contact the site admin`); 
                }

                resolve({ response: result[0] });
            })
            .catch(_ => reject("Server Error (TDUEFN)"));
    })
}
