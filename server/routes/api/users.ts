import express from 'express';
const router = express.Router();
import { socketIOServer } from '../../index';
import { LoginData, RegisterData } from '../../types/users';

import cors from 'cors';
import bodyParser from 'body-parser';

import { DEFAULT_COLUMNS, ORIGIN_URL } from '../../config';
import bcrypt from 'bcrypt'
import { validateLoginData, validateRegisterData } from '../../validation/users';
import handlePromise from '../../scripts/promiseHandler';
import { createJWTFromPayload } from '../../scripts/auth';
import {
    findAllUsers,
    findUser,
    findLastUser,
    userDoesNotExist,
    insertNewUser,
} from '../../scripts/users';

import { JWTError, QueryError } from '../../types/errors';

router.use(bodyParser.urlencoded({
    extended: true
}));

// Grabs all the users user names from the list
router.get("/", async (_, res) => {
    const [err, data] = await handlePromise<Array<any> | QueryError>
        (findAllUsers(DEFAULT_COLUMNS));

    if (err) {
        if (err === QueryError.NULL) {
            return res.send({
                success: false,
                message: `SERVER ERROR (FAU-NULL)`,
            })
        }

        return res.send({
            success: false,
            message: "Failed to grab users",
        })
    }

    res.send({
        success: true,
        response: data,
    })
});

router.get("/online", async (_, res) => {
    const onlineUsers = socketIOServer.onlineUsers;

    res.send({
        success: true,
        response: onlineUsers
    })
})

// Grabs a specific user by UID
router.get("/id/:id", async (req, res) => {
    const regex = /^[0-9]+$/;

    // If the uid is not a number, clearly the user tried to tamper with the url
    if (!regex.test(req.params.id)) {
        console.log(`${req.headers['x-forwarded-for'] || req.socket.remoteAddress} `);
        return res.send({
            success: false,
            response: "Invalid UID",
        });
    }

    // Grabs the user by UID from the db
    const [err, data] = await handlePromise<any | QueryError>(
        findUser(DEFAULT_COLUMNS, `uid = ${req.params.id}`));

    if (err) {
        // If there was no result, then there is no user with that uid
        if (err === QueryError.NORESULT) {
            return res.send({
                success: false,
                response: `No user with the uid: ${req.params.id} exists`,
            })
        }
        return res.send({
            success: false,
            response: `SERVER ERROR (FU-${err})`,
        })
    }

    // Returns the data assosciated with the index
    res.send({
        success: true,
        response: data,
    });
});

router.get("/last", async (_, res) => {
    const [err, data] = await handlePromise<object | string>(findLastUser());
    if (err) {
        return res.send({
            success: false,
            response: `SERVER ERROR (FLU-${err})`,

        })
    }

    res.send({
        success: true,
        response: data,
    });
});

router.post("/register", cors({ origin: ORIGIN_URL }), async (req, res) => {
    let data = req.body;

    const [success, message] = validateRegisterData(data);
    if (!success) {
        return res.send({
            success: false,
            response: message,
        })
    }
    data = data as RegisterData;

    // Checks if the username isn't already taken
    let [err, _] = await handlePromise<any | QueryError>(
        userDoesNotExist(["uid"], `name LIKE \"${data.username}\"`))

    if (err) {
        if (Object.values(QueryError).includes(err)) {
            return res.send({
                success: false,
                response: `SERVER ERROR (R-UDNE-${err})`,
            })
        }

        return res.send({
            success: false,
            response: "Username is already taken",
        })
    }


    // Checks if the email isn't already taken
    [err, _] = await handlePromise<any | QueryError>(
        userDoesNotExist(["uid"], `email LIKE \"${data.email}\"`))

    if (err) {
        if (Object.values(QueryError).includes(err)) {
            return res.send({
                success: false,
                response: `SERVER ERROR (R-UDNE-${err})`,
            })
        }

        return res.send({
            success: false,
            response: "Email is already in use",
        })
    }

    // Tries to create the new user
    [err, _] = await handlePromise<QueryError | RegisterData>(insertNewUser(data))
    if (err) {
        return res.send({
            success: false,
            response: `SERVER ERROR (R-INU-${err})`,
        })
    }

    res.send({
        success: true,
        response: "Succesfully Registered",
    })
})

router.post("/login", cors({ origin: ORIGIN_URL }), async (req, res) => {
    let data = req.body;

    // Makes sure all the login data meets the requirements
    const [success, message] = validateLoginData(data);
    if (!success) {
        return res.send({
            success: false,
            response: message,
        });
    }
    data = data as LoginData

    // Finds the user that is trying to be logged in as
    let [err, userDBInfo] = await handlePromise<any | QueryError>(
        findUser(["name", "uid", "password"], `name LIKE \"${data.username}\"`));

    if (err) {
        // User that is trying to be logged in as does not exist
        if (err === QueryError.NORESULT) {
            return res.send({
                success: false,
                response: "User does not exist, check your username or register with us"
            })
        }

        return res.send({
            success: false,
            response: `SERVER ERROR (L-FU-${err})`,
        })
    }

    if (!userDBInfo || typeof userDBInfo !== 'object' || !("name" in userDBInfo)
        || !("uid" in userDBInfo) || !("password" in userDBInfo)) {
        return res.send({
            success: false,
            response: `SERVER ERROR (L-OVERIF)`,
        })
    }

    // Compares the password with the one in the db
    bcrypt.compare(data.password, userDBInfo.password as string)
        .then(async match => {
            // User and password matched
            if (!match) {
                return res.send({
                    success: false,
                    response: "Incorrect Password",
                })
            }

            const payload = {
                username: userDBInfo.name,
                uid: userDBInfo.uid,
            }

            // Creates a jwt from the data and passes it back to the client
            const [errJWT, token] = await handlePromise<JWTError | string>(
                createJWTFromPayload(payload));

            if (errJWT) {
                return res.send({
                    success: false,
                    response: `SERVER ERROR (L-${errJWT})`,
                });
            }

            res.send({
                success: true,
                response: token,
            })
        })
})

export default router;
