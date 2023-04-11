import express from 'express';
import { db } from '../../index';
import handlePromise from '../../scripts/promiseHandler';
import { QueryError } from '../../types/errors';
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

    const [err, result] = await handlePromise<Array<any> | QueryError>(db.query(`SELECT CID, name, description FROM categories WHERE type = \"${req.params.type}\";`));
    if (err) {
        return res.send({
            success: false,
            response: "Server Error (SGC)",
        });
    }

    if (Array.isArray(result) && result.length == 0) {
        return res.send({
            success: false,
            message: `There are no categories`,
        });
    }

    res.send({
        success: true,
        response: result
    })
})

export default router;
