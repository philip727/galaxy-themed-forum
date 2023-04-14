import express from 'express';
import handlePromise from '../../scripts/promiseHandler';
import { QueryError } from '../../types/errors';
import passport from '../../middleware/passport';
import actionLimiter from '../../scripts/actionLimiter';
import { ACTION_LIMIT_TIME } from '../../config';
import { IJWTPayload } from '../../types/auth';
import { categoryExists } from '../../scripts/categories';
const router = express.Router();
import bodyParser from 'body-parser';
import { createNewPost, deletePost, getPostById, getPostComments } from '../../scripts/posts';

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get("/id/:id", async (req, res) => {
    const regex = /^[0-9]+$/;

    // If the uid is not a number, clearly the user tried to tamper with the url
    if (!regex.test(req.params.id)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        return res.send({
            success: false,
            response: "Invalid id",
        });
    }

    // Grabs the user by UID from the db
    const [err, data] = await handlePromise<any | QueryError>(
        getPostById(parseInt(req.params.id)));

    if (err) {
        // If there was no result, then there is no user with that uid
        if (err === QueryError.NORESULT) {
            return res.send({
                success: false,
                response: `No post with the id: ${req.params.id} exists`,
            })
        }
        return res.send({
            success: false,
            response: `SERVER ERROR (GPBD-${err})`,
        })
    }

    // Returns the data assosciated with the index
    res.send({
        success: true,
        response: data,
    });
})

router.get("/id/:id/comments", async (req, res) => {
    const regex = /^[0-9]+$/;

    // If the uid is not a number, clearly the user tried to tamper with the url
    if (!regex.test(req.params.id)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        return res.send({
            success: false,
            response: "Invalid id",
        });
    }

    const [err, data] = await handlePromise<any | QueryError>(
        getPostComments(parseInt(req.params.id)));

    if (err) {
        // If there was no result, then there is no user with that uid
        if (err === QueryError.NORESULT) {
            return res.send({
                success: false,
                response: `No post with the id: ${req.params.id} exists`,
            })
        }
        return res.send({
            success: false,
            response: `SERVER ERROR (GPBD-${err})`,
        })
    }

    // Returns the data assosciated with the index
    res.send({
        success: true,
        response: data,
    });
})

router.post("/new", passport, async (req, res) => {
    // Makes sure there is a jwtpayload from the passport
    if (!("jwtPayload" in req)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (CNP-JP)",
        });
    }

    const jwtPayload = req.jwtPayload as IJWTPayload;

    if (!actionLimiter(jwtPayload.uid)) {
        res.send({
            success: false,
            response: `Can only create a new post/comment every ${ACTION_LIMIT_TIME} seconds`,
        })
        return;
    }

    const regex = /^[0-9]+$/;
    let referer = req.headers.referer;
    if (!referer || typeof referer === "undefined") {
        res.send({
            success: false,
            response: "SERVER ERROR (CNP-NR)",
        })
        return;
    }
    const categoryId = referer.split("/").at(-1);

    if (!categoryId || !regex.test(categoryId)) {
        res.send({
            success: false,
            response: "SERVER ERROR (CNP-CI)",
        })
        return;
    }

    let [err, result] = await handlePromise<string>(categoryExists(parseInt(categoryId)));
    if (err) {
        return res.send({
            success: false,
            response: "SERVER ERROR (CNP-CID)",
        });
    }

    if (!("content" in req.body) || !("title" in req.body)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (CNP-DR)",
        });
    }

    if (req.body.title.length <= 0) {
        return res.send({
            success: false,
            response: "Please fill in the title field",
        });
    }

    if (req.body.content.length <= 0) {
        return res.send({
            success: false,
            response: "Please fill in the content field",
        });
    }

    if (req.body.content.length > 1000) {
        return res.send({
            success: false,
            response: "The content of a post can not be longer than 1000 characters",
        });
    }

    if (req.body.title.length > 30) {
        return res.send({
            success: false,
            response: "The title of a post can not be longer than 30 characters",
        });
    }

    [err, result] = await handlePromise<string | QueryError>(createNewPost(req.body.title, req.body.content, parseInt(categoryId), jwtPayload.uid));
    if (err) {
        return res.send({
            success: false,
            response: `SERVER ERROR (CNP-${err})`,
        });
    }

    res.send({
        success: true,
        response: result,
    })
})

router.post("/delete", passport, async (req, res) => {
    // Makes sure there is a jwtpayload from the passport
    if (!("jwtPayload" in req)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (DP-JP)",
        });
    }
    const jwtPayload = req.jwtPayload as IJWTPayload;

    if (!("commentId" in req.body)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (DP-DR)",
        });
    }

    const regex = /^[0-9]+$/;
    let referer = req.headers.referer;
    if (!referer || typeof referer === "undefined") {
        res.send({
            success: false,
            response: "SERVER ERROR (DP-NR)",
        })
        return;
    }

    const postId = referer.split("/").at(-1);
    if (!postId || !regex.test(postId)) {
        res.send({
            success: false,
            response: "SERVER ERROR (DP-CI)",
        })
        return;
    }

    const [err, result] = await handlePromise<string | QueryError>(
        deletePost(parseInt(postId), jwtPayload.uid));

    if (err) {
        return res.send({
            success: false,
            response: `SERVER ERROR (DP-${err})`,
        });
    }

    res.send({
        success: true,
        response: result,
    });
})

export default router;
