import express from 'express';
import handlePromise from '../../scripts/promiseHandler';
import { QueryError } from '../../types/errors';
import { findCategoriesByType, findCategory, findPostsInCategory } from '../../scripts/categories';
import { findUser } from '../../scripts/users';
import { DEFAULT_COLUMNS } from '../../config';
const router = express.Router();

router.get("/type/:type", async (req, res) => {
    const regex = /^[a-z]+$/;

    // If the uid is not only characters, then someone tried to tamper with the url
    if (!regex.test(req.params.type)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        return res.send({
            success: false,
            message: "Invalid Category Type",
        });
    }

    const [err, result] = await handlePromise<Array<any> | QueryError>(findCategoriesByType(req.params.type));
    if (err) {
        if (err === QueryError.NORESULT) {
            return res.send({
                success: false,
                message: `There are no posts in this type`,
            })
        }

        return res.send({
            success: false,
            message: `SERVER ERROR (FCBT-${err})`,
        })
    }

    res.send({
        success: true,
        response: result,
    })
})

router.get("/id/:id", async (req, res) => {
    const regex = /^[0-9]+$/;
    // If the id is not only numberr, then someone tried to tamper with the url
    if (!regex.test(req.params.id)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        return res.send({
            success: false,
            message: "Invalid Category ID",
        });
    }

    const [err, result] = await handlePromise<Array<any> | QueryError>(findCategory(parseInt(req.params.id)));
    if (err) {
        if (err === QueryError.NORESULT) {
            return res.send({
                success: false,
                message: `There is no category with the id ${req.params.id}`,
            })
        }

        return res.send({
            success: false,
            message: `SERVER ERROR (FCBI-${err})`,
        })
    }

    res.send({
        success: true,
        response: result,
    })
})


router.get("/id/:id/posts", async (req, res) => {
    const regex = /^[0-9]+$/;
    // If the id is not only numberr, then someone tried to tamper with the url
    if (!regex.test(req.params.id)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        return res.send({
            success: false,
            message: "Invalid Category Type",
        });
    }

    const [err, result] = await handlePromise<Array<any> | QueryError>(findPostsInCategory(parseInt(req.params.id)));
    if (err) {
        if (err === QueryError.NORESULT) {
            return res.send({
                success: false,
                message: `There are no posts in this category`,
            })
        }

        return res.send({
            success: false,
            message: `SERVER ERROR (FPIC-${err})`,
        })
    }

    if (!result) {
        return res.send({
            success: false,
            message: `SERVER ERROR (FPIC-NULL-R)`,
        })
    }


    const postsResults: {id: number, name: string, profile_id: number, profile_name: string, profile_role: string, profile_pfp: string }[] = [];

    for (let i = 0; i < result.length; i++) {
        const post = result[i];
        const [err2, res2] = await handlePromise<any | QueryError>(findUser(DEFAULT_COLUMNS, `uid = ${post.profile_id}`));
        if (err2) {
            res.send({
                success: false,
                message: `SERVER ERROR (FPIC-FU-${err})`,
            })
            continue 
        }

        postsResults.push({ id: post.id, name: post.name, profile_id: post.profile_id, profile_name: res2.name, profile_role: res2.role, profile_pfp: res2.pfpdestination })
    }

    res.send({
        success: true,
        response: postsResults,
    })
})

export default router;
