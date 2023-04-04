import express from 'express';
const router = express.Router();

// POST stuff 
const cors = require('cors');
const bodyParser = require('body-parser');

// JWT
import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../../config/keys';
import { IJWTVerifiedTokenData } from '../../types/auth';
import { verifyJWTData } from '../../validation/auth';


router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(cors());

router.post('/verifylogin', (req, res) => {
    // Makes sure the post contains the jwt 
    if (!verifyJWTData(req.body)) {
        res.send({
            success: false,
            response: "Failed to verify session token",
        })
    }
    const data = req.body as IJWTVerifiedTokenData;

    try {
        const jwtToken = data.jwt.split("Bearer ")[1];
        const verified = jwt.verify(jwtToken, JWT_KEY)

        res.send({
            success: true,
            response: data.jwt,
        });
    } catch (_) {
        res.send({
            success: false,
            response: "Failed to verify session token",
        })
    }
})




export default router;
