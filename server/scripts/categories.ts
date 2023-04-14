import { db } from "..";
import { QueryError } from "../types/errors";
import handlePromise from "./promiseHandler";

export const findPostsInCategory = (categoryId: number): Promise<Array<any> | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(
            db.query(`SELECT * FROM posts WHERE category_id = ${categoryId}`));

        if (err || !result) {
            return reject(QueryError.NULL);
        }

        if (Array.isArray(result) && result.length == 0) {
            return reject(QueryError.NORESULT);
        }

        return resolve(result);
    })
}

export const findCategory = (categoryId: number): Promise<Array<any> | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(
            db.query(`SELECT id, name, description, type FROM categories WHERE id = ${categoryId}`))


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

export const findCategoriesByType = (categoryType: string): Promise<Array<any> | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(
            db.query(`SELECT id, name, description FROM categories WHERE type = \"${categoryType}\";`));

        if (err || !result) {
            return reject(QueryError.NULL);
        }

        if (Array.isArray(result) && result.length == 0) {
            return reject(QueryError.NORESULT);
        }

        return resolve(result);
    })
}

export const categoryExists = (id: number): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err] = await handlePromise<Array<any> | QueryError>(findCategory(id));
        if (err) {
            return reject(err);
        }

        return resolve("Category exists");
    })
}
