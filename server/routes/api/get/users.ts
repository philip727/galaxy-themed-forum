import express from 'express';
const router = express.Router();
import { db } from '../../../index'

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
router.get("/getuser/:id", (req, response) => {
    const regex = /^[0-9]+$/;
    // If the uid is not a number, clearly the user tried to tamper with the url
    if (!regex.test(req.params.id)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        response.send({
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
            response.send({
                success: false,
                message: `No user with the uid: ${req.params.id} exists`,
            });
            return;
        }
        // Returns the data assosciated with the index
        response.send({
            success: true,
            response: data,
        });
        }
    )
   .catch(_ =>
        response.send({
            success: false,
            message: `No user with the uid: ${req.params.id} exists`,
        })
    );
});

module.exports = router;
