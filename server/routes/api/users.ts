import express from 'express';
const router = express.Router();
import { db } from '../../index';
import { SuccessResponse } from '../../types/api';
import { RegisterData } from '../../types/users';
const cors = require('cors');
const bodyParser = require('body-parser');
import bcrypt from 'bcrypt'

// Validation imports
import { validateResponse } from '../../validation/api';
import { validateEmail, validatePassword, validateUsername } from '../../validation/users';

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

// Validates the register data
const checkRegisterData = (data: any): SuccessResponse => {
    // Make sure the data is an object
    if (!data || !(typeof data == "object")) {
        return {
            success: false,
            response: "Failed to receive data from client, try refreshing",
        };
    };

    // Make sure the data contains all the required properties
    if (!("username" in data) || !("email" in data) || !("password" in data)) {
        return {
            success: false,
            response: "Please fill in all required fields",
        };
    };


    // Makes sure the username is ok
    const [validUsername, usernameMessage] = validateUsername(data.username)
    if (!validUsername) {
        return {
            success: false,
            response: usernameMessage,
        };
    }

    // Makes sure the password is ok and meets the criteria
    const [validPassword, passwordMessage] = validatePassword(data.password);
    if (!validPassword) {
        return {
            success: false,
            response: passwordMessage
        };
    }
   
    // Makes sure the email is ok
    const [validEmail, emailMessage] = validateEmail(data.email);
    if (!validEmail) {
        return {
            success: false,
            response: emailMessage,
        }
    }

    return {
        success: true,
        response: data,
    };
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
const attemptToRegisterData = (data: any): Promise<SuccessResponse> => {
    return new Promise(async (resolve, reject) => {
        // Checks if the data request is valid
        const isValidData = checkRegisterData(data);
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

router.post("/register", (req, res) => {
    let data = req.body;

    attemptToRegisterData(data)
        .then(d => res.send(d))
        .catch(err => res.send(err));
})

module.exports = router;
