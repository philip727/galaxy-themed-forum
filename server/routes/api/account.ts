import path from 'path'
import formidable from 'formidable';
import fs from 'fs';
import { QueryError } from '../../types/errors';
import passport from '../../middleware/passport';
import { IJWTPayload } from '../../types/auth';

import bodyParser from 'body-parser';
import express from 'express';
import { PROFILE_PICTURE_FOLDER } from '../../config';
import handlePromise from '../../scripts/promiseHandler';
import { clearUserProfilePicture, setUserBio, setUserProfilePicture } from '../../scripts/users';
import cors from 'cors'

const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/uploadpfp', passport, async (req, res) => {
    // Creates the upload directory for the files
    const form = formidable({
        multiples: false,
        maxFileSize: 8 * 1024 * 1024,
        uploadDir: PROFILE_PICTURE_FOLDER
    });

    // Makes sure there is a jwtpayload from the passport
    if (!("jwtPayload" in req)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (UPFP-JP)",
        });
    }

    const jwtPayload = req.jwtPayload as IJWTPayload;

    form.parse(req, async (err, _, files) => {
        // Makes sure we have an avatar from the form
        if (err || !files.avatar || typeof files.avatar === 'undefined') {
            return res.send({
                success: false,
                response: "Failed to upload profile picture",
            });
        }

        // Dont want multiple files lol
        if (Array.isArray(files.avatar)) {
            return res.send({
                success: false,
                response: "Can't upload multiple profile pictures",
            });
        }

        const file = files.avatar;

        try {
            if (!file.originalFilename) {
                return res.send({
                    success: false,
                    response: "SERVER ERROR (UPFP-OF)",
                });
            }

            // Renames the file at the location so we can easily get it when going to a page
            const ext = path.extname(file.originalFilename);
            const newFilename = `${jwtPayload.uid}${ext}`
            fs.renameSync(file.filepath, path.join(PROFILE_PICTURE_FOLDER, newFilename));

            // Sets the user profile picture in the db
            const [err, _] = await handlePromise<QueryError | string>(
                setUserProfilePicture(jwtPayload.uid, "public/profiles/" + newFilename));

            if (err) {
                return res.send({
                    success: false,
                    response: `SERVER ERROR (UPFP-SUPP-${err})`,
                });
            }

            res.send({
                success: true,
                response: "Successfully uploaded new profile picture",
            });
        } catch {
            return res.send({
                success: false,
                response: "SERVER ERROR (UPFP-RN)",
            });
        }

    })
})

router.put('/clearpfp', passport, async (req, res) => {
    // Makes sure there is a jwtpayload from the passport
    if (!("jwtPayload" in req)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (UPFP-JP)",
        });
    }

    const jwtPayload = req.jwtPayload as IJWTPayload;

    const [err, _] = await handlePromise<QueryError | string>(
        clearUserProfilePicture(jwtPayload.uid));

    if (err) {
        return res.send({
            success: false,
            response: `SERVER ERROR (UPFP-CUPP-${err})`,
        });
    }

    res.send({
        success: true,
        response: "Successfully uploaded new profile picture",
    });
})

router.post('/setbio', passport, async (req, res) => {
    // Makes sure there is a jwtpayload from the passport
    if (!("jwtPayload" in req)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (UPB-JP)",
        });
    }

    const jwtPayload = req.jwtPayload as IJWTPayload;

    const data = req.body;

    if (!("bio" in data)) {
        return res.send({
            success: false,
            response: "SERVER ERROR (UPB-BD)",
        });
    };

    if (data.bio.length > 200) {
        return res.send({
            success: false,
            response: "Bio can only be 200 characters long",
        });
    }

    const [err, _] = await handlePromise<QueryError | string>(
        setUserBio(jwtPayload.uid, data.bio));

    if (err) {
        return res.send({
            success: false,
            response: `SERVER ERROR (UPB-SUB-${err})`,
        });
    }

    res.send({
        success: true,
        response: "Successfully updated bio",
    });
})

export default router;
