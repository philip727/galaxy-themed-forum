import express from 'express';
const router = express.Router();

// POST stuff 
const cors = require('cors');
const bodyParser = require('body-parser');

// JWT
import { IJWTToken } from '../../types/auth';
import { verifyReceivedJWT } from '../../validation/auth';
import { verifyJWTToken } from '../../scripts/auth';


router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(cors());

router.post('/verifylogin', (req, res) => {
    // Makes sure the post contains the jwt 
    if (!verifyReceivedJWT(req.body)) {
        return res.send({
            success: false,
            response: "Failed to verify session token",
        })
    }
    const data = req.body as IJWTToken;
    verifyJWTToken(data.jwt)
    .then(result => res.send({
        success: true,
        response: result,
    }))
    .catch(err => res.send({
        success: false,
        response: err,
    }))

    console.log("ben");
})




export default router;
