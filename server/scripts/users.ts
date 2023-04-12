import { db } from "../index";
import { QueryError } from "../types/errors";
import { RegisterData } from "../types/users";
import bcrypt from 'bcrypt'
import handlePromise from "./promiseHandler";
import { BCRYPT_SALT_ROUNDS, DEFAULT_COLUMNS } from "../config";

export const findUser = (columns: string[], condition: string): Promise<any | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(db.query(`SELECT ${columns.toString()} FROM users WHERE ${condition};`));
        if (err || !result) {
            return reject(QueryError.NULL);
        }

        if (Array.isArray(result) && result.length == 0) {
            return reject(QueryError.NORESULT);
        }

        if (Array.isArray(result) && result.length > 1) {
            return reject(QueryError.UNEXPECTEDRESULT);
        }

        return resolve(result[0]);
    })
}

export const findAllUsers = (columns: string[]): Promise<Array<any> | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(db.query(`SELECT ${columns.toString()} FROM users;`));
        if (err || !result) {
            return reject(QueryError.NULL);
        }

        if (Array.isArray(result) && result.length == 0) {
            return reject(QueryError.NORESULT);
        }

        return resolve(result);
    })
}

export const findLastUser = (columns: string[] = DEFAULT_COLUMNS): Promise<any | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any> | QueryError>(db.query(`SELECT ${columns.toString()} FROM users ORDER BY UID DESC LIMIT 1;`));
        if (err || !result) {
            return reject(QueryError.NULL);
        }

        if (Array.isArray(result) && result.length == 0) {
            return reject(QueryError.NORESULT);
        }

        if (Array.isArray(result) && result.length > 1) {
            return reject(QueryError.UNEXPECTEDRESULT);
        }

        return resolve(result[0]);
    })
}

export const userDoesNotExist = (columns: string[], condition: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err] = await handlePromise<Array<any> | QueryError>(findUser(columns, condition));
        if (err && err != QueryError.NORESULT) {
            return reject(err);
        }

        if (err == QueryError.NORESULT) {
            return resolve("User doesn't exist");
        }

        return reject("User Exists");
    })
}

export const userExists = (columns: string[], condition: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err] = await handlePromise<Array<any> | QueryError>(findUser(columns, condition));
        if (err) {
            return reject(err);
        }

        return resolve("User exists");
    })
}

export const insertNewUser = (data: RegisterData): Promise<RegisterData | QueryError> => {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS, async (bcryptErr, hash) => {
            if (bcryptErr) {
                return reject(QueryError.UNEXPECTEDRESULT);
            }

            // Inserts into DB with hashed password
            const [err, _] = await handlePromise<Array<any>>(
                db.query(`INSERT INTO users (name, email, password, role) VALUES (\"${data.username}\", \"${data.email}\", \"${hash}\", \"user\")`));

            if (err) {
                return reject(QueryError.INSERTIONFAILED);
            }

            console.log(`Created new user ${data.username} / ${hash} / ${data.email}`);

            resolve(data);
        })
    })
}

export const setUserProfilePicture = (uid: number, destination: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`UPDATE users SET pfpdestination = \"${destination}\" WHERE uid = ${uid};`));

        if (err) {
            return reject(QueryError.UPDATEFAILED);
        }

        resolve("Successfully updated profile picture");
    })
}

export const clearUserProfilePicture = (uid: number): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`UPDATE users SET pfpdestination = NULL WHERE uid = ${uid};`));

        if (err) {
            return reject(QueryError.UPDATEFAILED);
        }

        resolve("Successfully updated profile picture");
    })
}

export const setUserBio = (uid: number, bio: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`UPDATE users SET bio = \"${bio}\" WHERE uid = ${uid};`));

        if (err) {
            return reject(QueryError.UPDATEFAILED);
        }

        resolve("Successfully updated profile picture");
    })
}

export const getUserCommentsOnProfile = (uid: string): Promise<Array<any> | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(
            db.query(`SELECT * FROM profile_comments WHERE profile_id = ${uid}`));

        if (err || !result) {
            return reject(QueryError.NULL);
        }

        if (Array.isArray(result) && result.length == 0) {
            return reject(QueryError.NORESULT);
        }

        const commentArray: { id: number, poster_id: number, poster_name: string, poster_role: string, pfpdestination: string, content: string, post_date: string }[] = []
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const [err, res] = await handlePromise<any>(findUser(DEFAULT_COLUMNS, `uid = ${element.poster_id}`));

            if (err || !res) {
                continue;
            }

            commentArray.push({ id: element.id, poster_id: element.poster_id, poster_name: res.name, poster_role: res.role, pfpdestination: res.pfpdestination, content: element.content, post_date: element.postdate });
        }

        resolve(commentArray);
    })
}

export const createNewCommentOnProfile = (profileId: string, posterId: number, content: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`INSERT INTO profile_comments (profile_id, poster_id, content) VALUES (\"${profileId}\", \"${posterId}\", \"${content}\");`));

        if (err) {
            return reject(QueryError.INSERTIONFAILED);
        }

        resolve("Successfully posted comment");
    })
}

export const deleteCommentOnProfile = (posterId: number, commentId: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`DELETE FROM profile_comments WHERE poster_id = ${posterId} AND id = ${commentId};`));

        if (err) {
            return reject(QueryError.DELETEFAILED);
        }

        resolve("Successfully deleted comment");
    })
}
