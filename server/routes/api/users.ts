import express from 'express';
const router = express.Router();
import { db } from '../../index';
const cors = require('cors');
router.use(cors());
// Grabs all the users user names from the list
router.get("/getusers", (_, res) => {
    db.query("SELECT name, uid FROM users")
        .then(data =>
            res.send(
                {
                    success: true,
                    response: data
                })
        )
        .catch(_ =>
            res.send({
                success: false,
                message: "Failed to grab users",
            })
        );
});

// Grabs a specific user by UID
router.get("/getuser/:id", (req, res) => {
    const regex = /^[0-9]+$/;

    // If the uid is not a number, clearly the user tried to tamper with the url
    if (!regex.test(req.params.id)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        res.send({
            success: false,
            message: "Invalid UID",
        });
        return;
    }

    // Grabs the user by UID from the db
    db.query(`SELECT name, uid FROM users WHERE uid = ${req.params.id}`)
        .then(data => {
            // If the array is empty, then the user index hasn't been created
            if (Array.isArray(data) && data.length == 0) {
                res.send({
                    success: false,
                    message: `No user with the uid: ${req.params.id} exists`,
                });
                return;
            }
            // Returns the data assosciated with the index
            res.send({
                success: true,
                response: data,
            });
        })
        .catch(_ =>
            res.send({
                success: false,
                message: `No user with the uid: ${req.params.id} exists`,
            })
        );
});

router.post("/register", (req, _) => {
    console.log(req.body);
})

module.exports = router;
