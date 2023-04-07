import express from 'express';
const router = express.Router();
import { db } from '../../index';
import { IQueryData, LoginData, RegisterData } from '../../types/users';

// POST stuff 
const cors = require('cors');
const bodyParser = require('body-parser');

// Encryption Imports
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../../config/keys';

// Validation imports
import { validateKeys } from '../../validation/api';
import { validateLoginData, validateRegisterData } from '../../validation/users';
import { tryCheckIfUserDoesNotExistByName, tryCheckIfUserDoesNotExistByEmail, tryCreateNewUser, tryCheckIfUserExistsByName } from '../../scripts/users';
import handlePromise from '../../scripts/promiseHandler';
import { createJWTFromPayload } from '../../scripts/auth';

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(cors());


// Grabs all the users user names from the list
router.get("/getusers", (_, res) => {
    db.query("SELECT name, uid, role FROM users")
        .then(data =>
            res.send({
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
    db.query(`SELECT name, uid FROM users WHERE uid = ${req.params.id};`)
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

router.post("/register", async (req, res) => {
    let data = req.body;

    const [success, message] = validateRegisterData(data);
    if (!success) {
        return res.send({
            success: false,
            response: message,
        })
    }
    data = data as RegisterData; // Cast here because if it gets through the first function, it must be register data and LSP completions lol 

    // Checks if the username isn't already taken
    let [err, _] = await handlePromise<IQueryData | string>(tryCheckIfUserDoesNotExistByName(data.username, ["uid"]))
    if (err) {
        if (typeof err === "object") {
            return res.send({
                success: false,
                response: "Username is already taken",
            })
        }

        return res.send({
            success: false,
            response: err,
        })
    }

    // Checks if the email isn't already taken
    [err, _] = await handlePromise<IQueryData | string>(tryCheckIfUserDoesNotExistByEmail(data.email, ["uid"]))
    if (err) {
        if (typeof err === "object") {
            return res.send({
                success: false,
                response: "Email is already taken",
            })
        }

        return res.send({
            success: false,
            response: err,
        })
    }

    // Tries to create the new user
    [err, _] = await handlePromise<IQueryData | string>(tryCreateNewUser(data))
    if (err) {
        return res.send({
            success: false,
            response: err,
        })
    }

    res.send({
        success: true,
        response: "Succesfully Registered",
    })
})

router.post("/login", async (req, res) => {
    let data = req.body;

    const [success, message] = validateLoginData(data);
    if (!success) {
        return res.send({
            success: false,
            response: message,
        });
    }
    data = data as LoginData

    let [err, userData] = await handlePromise<IQueryData | string>(tryCheckIfUserExistsByName(data.username, ["name", "uid", "password"]));
    if (err) {
        console.log("here");
        return res.send({
            success: false,
            response: "User does not exist, check your username or register with us"
        })
    }
    
    // Makes sure the user columns exist
    // @ts-ignore
    if (typeof userData.response !== 'object' || !validateKeys(userData.response, ["password", "uid", "name"])) {
        return res.send({
            success: false,
            response: "Server Error (SLK)",
        })
    }
    
    // @ts-ignore
    bcrypt.compare(data.password, userData.response.password).then(match => {
        // User and password matched
        if (!match) {
            return res.send({
                success: false,
                response: "Incorrect Password",
            })
        }

        const payload = {
            // @ts-ignore
            username: userData.response.name,
            // @ts-ignore
            uid: userData.response.uid,
        }

        createJWTFromPayload(payload)
        .then(token => res.send({
            success: true,
            response: token,
        }))
        .catch(err => res.send({
            success: false,
            response: err
        }));
    })
})

export default router;
