import express from 'express';
const router = express.Router();
import { db, socketIOServer } from '../../index';
import { IQueryData, LoginData, RegisterData } from '../../types/users';

const cors = require('cors');
const bodyParser = require('body-parser');
import { DEFAULT_COLUMNS, ORIGIN_URL } from '../../config';
import bcrypt from 'bcrypt'
import { validateLoginData, validateRegisterData } from '../../validation/users';
import handlePromise from '../../scripts/promiseHandler';
import { createJWTFromPayload } from '../../scripts/auth';
import { findAllUsers, findUser, findLastUser, userDoesNotExist, insertNewUser } from '../../scripts/users';
import { JWTError, QueryError } from '../../types/errors';

const multer = require('multer');
const upload = multer({ 
    dest: 'uploads',
    fileSize: 8 * 1024 * 1024,
});

router.use(bodyParser.urlencoded({
    extended: true
}));

// Grabs all the users user names from the list
router.get("/", async (_, res) => {
    const [err, data] = await handlePromise<Array<any> | QueryError>(findAllUsers(DEFAULT_COLUMNS));
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
    const [err, data] = await handlePromise<any | QueryError>(findUser(DEFAULT_COLUMNS, `uid = ${req.params.id}`));
    if (err) {
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
    data = data as RegisterData; // Cast here because if it gets through the first function, it must be register data and LSP completions lol 

    // Checks if the username isn't already taken
    let [err, _] = await handlePromise<any | QueryError>(userDoesNotExist(["uid"], `name LIKE \"${data.username}\"`))
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
    [err, _] = await handlePromise<any | QueryError>(userDoesNotExist(["uid"], `email LIKE \"${data.email}\"`))
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

    const [success, message] = validateLoginData(data);
    if (!success) {
        return res.send({
            success: false,
            response: message,
        });
    }
    data = data as LoginData

    let [err, userData] = await handlePromise<any | QueryError>(findUser(["name", "uid", "password"], `name LIKE \"${data.username}\"`));
    if (err) {
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

    if (!userData || typeof userData !== 'object' || !("name" in userData) || !("uid" in userData) || !("password" in userData)) {
        return res.send({
            success: false,
            response: `SERVER ERROR (L-OVERIF)`,
        })
    }


    bcrypt.compare(data.password, userData.password as string).then(async match => {
        // User and password matched
        if (!match) {
            return res.send({
                success: false,
                response: "Incorrect Password",
            })
        }

        const payload = {
            username: userData.name,
            uid: userData.uid,
        }

        const [errJWT, token] = await handlePromise<JWTError | string>(createJWTFromPayload(payload));
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

router.post('/uploadpfp', upload.single('avatar'), async (req, res) => {
    console.log(req);

    res.send({});
})

export default router;
