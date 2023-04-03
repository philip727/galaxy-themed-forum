import express from 'express';
const router = express.Router();
import { db } from '../../index';
import { SuccessResponse } from '../../types/api';
import { IUserExistData, LoginData, RegisterData } from '../../types/users';
const cors = require('cors');
const bodyParser = require('body-parser');
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


// Validation imports
import { validateResponse } from '../../validation/api';
import { validateColumns, validateLoginData, validateRegisterData } from '../../validation/users';
import { JWT_KEY } from '../../config/keys';

const BCRYPT_SALT_ROUNDS = 12;
router.use(bodyParser.urlencoded({
    extended: true
}));
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


const tryDoesUserExistByName = (username: string, columns: string[]): Promise<SuccessResponse> => {
    return new Promise(async (resolve, reject) => {
        await db.query(`SELECT ${columns.toString()} FROM users WHERE name LIKE \"${username}\";`)
            .then(d => {
                // If the array is empty, then the user does not exist
                if (!Array.isArray(d) || d.length == 0) {
                    return resolve({ success: false, response: "User does not exist" });
                }

                // If the user exists, then respond with the data
                resolve({ success: true, response: d });
            })
            .catch(_ => {
                return reject({ success: false, response: "Server Error (6)" })
            })
    })
}

// Checks if the user exists
const tryDoesUserExist = (data: RegisterData): Promise<SuccessResponse> => {
    return new Promise(async (resolve, reject) => {
        // Checks if the user already exists by checking the username and email
        await db.query(`SELECT * FROM users WHERE email LIKE \"${data.email}\" OR name LIKE \"${data.username}\";`)
            .then(d => {
                // If the array is longer than 0 then we have gotten a result and the user exists
                if (Array.isArray(d) && d.length > 0) {
                    return reject({ success: false, response: "User already exists" });
                }

                // If the array isn't longer than 0, then the user doesn't exist
                resolve({ success: true, response: data });
            })
            .catch(_ => {
                return reject({ success: false, response: "Server Error (5)" });
            })
    })
}

// Insert user into table
const tryInsertUser = (data: RegisterData): Promise<SuccessResponse> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS, async (err, hash) => {
            if (err) {
                return reject({ success: false, response: "Server Error (4)" });
            }
            // Inserts into DB with hashed password
            await db.query(`INSERT INTO users (name, email, password) VALUES (\"${data.username}\", \"${data.email}\", \"${hash}\")`)
                .then(_ => {
                    console.log(`New registered user ${data.username} / ${hash} / ${data.email}`);

                    resolve({ success: true, response: "Succesfully registered" });
                })
                .catch(err => {
                    return reject({ success: false, response: err });
                });
        });
    })
}

// Register the data
const tryToRegisterWithData = (data: any): Promise<SuccessResponse> => {
    return new Promise(async (resolve, reject) => {
        // Checks if the data request is valid
        const isValidData = validateRegisterData(data);
        if (!isValidData.success) {
            return reject(isValidData);
        }
        data = data as RegisterData; // Cast here because if it gets through the first function, it must be register data and LSP completions lol 

        // Checks if the user already exists
        let doesUserExist = {} as SuccessResponse;
        await tryDoesUserExist(data)
            .then(d => doesUserExist = d)
            .catch(err => doesUserExist = err);

        if (!validateResponse(doesUserExist)) {
            return reject({ success: false, response: "Server Error (2)" });
        }

        if (!doesUserExist.success) {
            return reject(doesUserExist);
        }

        // Tries to insert the user
        let insertUser = {} as SuccessResponse;
        await tryInsertUser(data)
            .then(d => insertUser = d)
            .catch(err => insertUser = err);

        if (!validateResponse(insertUser)) {
            return reject({ success: false, response: "Server Error (3)" });
        }

        if (!insertUser.success) {
            return reject(insertUser);
        }

        resolve(insertUser as SuccessResponse);
    })
}



const tryToLoginWithData = (data: any): Promise<SuccessResponse> => {
    return new Promise(async (resolve, reject) => {
        // Checks if the data request is valid
        const isValidData = validateLoginData(data);
        if (!isValidData.success) {
            return reject(isValidData);
        }

        data = data as LoginData

        let doesUserExist = {} as SuccessResponse;
        await tryDoesUserExistByName(data.username, ["uid", "name", "password"])
            .then(d => doesUserExist = d)
            .catch(err => doesUserExist = err);

        if (!doesUserExist.success) {
            return reject(doesUserExist);
        }

        if (!Array.isArray(doesUserExist.response)) {
            return reject({
                success: false,
                response: "Server Error (7)",
            })
        }

        if (doesUserExist.response.length > 1) {
            return reject({
                success: false,
                response: "Server Error (8)",
            })
        }

        if (typeof doesUserExist.response[0] !== 'object' || !validateColumns(doesUserExist.response[0], ["password", "uid", "name"])) {
            return reject({
                success: false,
                response: "Server Error (9)",
            })
        }


        bcrypt.compare(data.password, doesUserExist.response[0].password).then(match => {
            // User and password matched
            if (!match) {
                return reject({
                    success: false,
                    response: "Incorrect Password",
                })
            }

            const payload = {
                // @ts-ignore
                username: doesUserExist.response[0].name,
                // @ts-ignore
                uid: doesUserExist.response[0].uid,
            }

            jwt.sign(payload, JWT_KEY, { expiresIn: 7_890_000 }, (err, token) => {
                if (err) {
                    return reject({
                        success: false,
                        response: "Server Error (10)",
                    })
                }
                return resolve({
                    success: true,
                    response: "Bearer " + token,
                })
            })
        })
    })
}

router.post("/register", (req, res) => {
    let data = req.body;

    tryToRegisterWithData(data)
        .then(d => res.send(d))
        .catch(err => res.send(err));
})

router.post("/login", (req, res) => {
    let data = req.body;

    tryToLoginWithData(data)
        .then(d => res.send(d))
        .catch(err => res.send(err));

})

module.exports = router;

