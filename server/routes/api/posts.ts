import express from 'express';
import { db } from '../../index';
import handlePromise from '../../scripts/promiseHandler';
import { QueryError } from '../../types/errors';
const router = express.Router();

router.get("/fromcategory/:catid", async (req, res) => {
    const regex = /^[0-9]+$/;
    // If the uid is not a number, clearly the user tried to tamper with the url
    if (!regex.test(req.params.catid)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        return res.send({
            success: false,
            message: "Invalid Category ID",
        });
    }

    const [err, result] = await handlePromise<Array<any> | QueryError>(db.query(`SELECT PID, name, poster_UID FROM posts WHERE parent_CID = ${req.params.catid}`));  
    if (err) {
        return res.send({
            success: false,
            response: "Server Error (SGCP)",
        })
    }

    if (Array.isArray(result) && result.length == 0) {
        return res.send({
            success: false,
            message: `There are no posts in this category`,
        });
    }

    res.send({
        success: true,
        response: result
    })
})

export default router;
