import express from 'express';
import handlePromise from '../../scripts/promiseHandler';
import { QueryError } from '../../types/errors';
import { findCategoriesByType, findPostsInCategory } from '../../scripts/categories';
const router = express.Router();

router.get("/:type", async (req, res) => {
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
            message:`SERVER ERROR (FCBT-${err})`,
        })
    }

    res.send({
        success: true,
        response: result,
    })
})


router.get("/:id/posts", async (req, res) => {
    const regex = /^[0-9]+$/;
    // If the uid is not only numberr, then someone tried to tamper with the url
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
            message:`SERVER ERROR (FPIC-${err})`,
        })
    }

    res.send({
        success: true,
        response: result,
    })
})

export default router;
