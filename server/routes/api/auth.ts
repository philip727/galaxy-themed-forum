import express from 'express';
const router = express.Router();

// POST stuff 
const cors = require('cors');
const bodyParser = require('body-parser');

// JWT
import { IJWTToken } from '../../types/auth';
import { verifyReceivedJWT } from '../../validation/auth';
import { verifyJWTToken } from '../../scripts/auth';
import handlePromise from '../../scripts/promiseHandler';


router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(cors());

router.post('/verifylogin', async (req, res) => {
    // Makes sure the post contains the jwt 
    if (!verifyReceivedJWT(req.body)) {
        return res.send({
            success: false,
            response: "Failed to verify session token"
        })
    }
    const data = req.body as IJWTToken;
    const [err, result] = await handlePromise<string>(verifyJWTToken(data.jwt));
    if (err) {
        return res.send({
            success: false,
            response: err
        });
    }

    res.send({ 
        success: true, 
        response: result 
    });
})




export default router;
