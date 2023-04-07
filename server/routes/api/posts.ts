import express from 'express';
import { db } from '../../index';
const router = express.Router();

router.get("/getcategories", (_, res) => {
    db.query("SELECT CID, name, description FROM categories")
        .then(result => {
            // If the array is empty, then the user index hasn't been created
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
        .catch(err => res.send({
            success: false,
            response: err,
        }));
})

export default router;
