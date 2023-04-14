import { db } from "..";
import { DEFAULT_COLUMNS } from "../config";
import { QueryError } from "../types/errors";
import handlePromise from "./promiseHandler";
import { findUser } from "./users";

export const createNewPost = (name: string, content: string, categoryId: number, profileId: number): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`INSERT INTO posts (name, content, category_id, profile_id) VALUES (\"${name}\", \"${content}\", \"${categoryId}\", \"${profileId}\");`));

        if (err) {
            return reject(QueryError.INSERTIONFAILED);
        }

        resolve("Successfully created new post");
    })
}

export const deletePost = (postId: number, posterId: number): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`DELETE FROM posts WHERE profile_id = ${posterId} AND id = ${postId};`));

        if (err) {
            return reject(QueryError.DELETEFAILED);
        }

        resolve("Successfully deleted post");
    })
}

export const deletePostComment = (posterId: number, commentId: number): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`DELETE FROM post_comments WHERE profile_id = ${posterId} AND id = ${commentId};`));

        if (err) {
            return reject(QueryError.DELETEFAILED);
        }

        resolve("Successfully deleted comment");
    })
}

export const getPostById = (id: number): Promise<any | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(
            db.query(`SELECT * FROM posts WHERE id = ${id}`));

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

export const postExists = (id: number): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err] = await handlePromise<any | QueryError>(getPostById(id));
        if (err) {
            return reject(err);
        }

        return resolve("User exists");
    })
}

export const getPostComments = (id: number): Promise<Array<any> | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, result] = await handlePromise<Array<any>>(
            db.query(`SELECT * FROM post_comments WHERE post_id = ${id}`));

        if (err || !result) {
            return reject(QueryError.NULL);
        }

        if (Array.isArray(result) && result.length == 0) {
            return reject(QueryError.NORESULT);
        }

        const commentArray: { id: number, poster_id: number, poster_name: string, poster_role: string, pfpdestination: string, content: string, post_date: string }[] = []
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const [err, res] = await handlePromise<any>(findUser(DEFAULT_COLUMNS, `uid = ${element.profile_id}`));

            if (err || !res) {
                continue;
            }

            commentArray.push({ id: element.id, poster_id: element.profile_id, poster_name: res.name, poster_role: res.role, pfpdestination: res.pfpdestination, content: element.content, post_date: element.postdate });
        }

        resolve(commentArray);
    })
}

export const createNewCommentOnPost = (postId: string, profileId: number, content: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`INSERT INTO post_comments (profile_id, post_id, content) VALUES (\"${profileId}\", \"${postId}\", \"${content}\");`));

        if (err) {
            return reject(QueryError.INSERTIONFAILED);
        }

        resolve("Successfully posted comment");
    })
}

export const deleteCommentOnPost = (profileId: number, commentId: string): Promise<string | QueryError> => {
    return new Promise(async (resolve, reject) => {
        const [err, _] = await handlePromise<Array<any>>(
            db.query(`DELETE FROM post_comments WHERE profile_id = ${profileId} AND id = ${commentId};`));

        if (err) {
            return reject(QueryError.DELETEFAILED);
        }

        resolve("Successfully deleted comment");
    })
}
