require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary');
const db = require('../database/db').database;
const emailSender = require('../utils/EmailSender');


const { CLOUD_NAME, API_KEY, API_SECRET } = process.env

cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true
})

function b64toImage(body) {
    return new Promise((resolve, reject) => {
        let { url: rawUrl, filename } = body;
        let url = rawUrl.replace(/^data:image\/[^;]+;base64,/, "");
        const pathWay = path.resolve(__dirname, '../', 'temp', `${filename}`);
        const buffer = Buffer.from(url, 'base64');
        fs.writeFile(pathWay, buffer, (e) => {
            if (e) {
                reject(e);
            }
            resolve(pathWay);
        });

    })
}

module.exports = {

    getUsers(req, res) {
        db.list()
            .then(json => res.json(json))
            .catch(e => console.error(e));
    },

    /** Only works on temp session*/
    getUserEmail(req, res) {
        if (req.session) {
            const email = req.session.tempSession.email;
            return res.json({ email });
        }
        res.status(404).json({ message: 'no session logged' });
    },

    getImage(req, res) {
        if (!req.body) {
            return res.status(400).json({ message: 'no body' });
        }
        (async () => {
            try {
                const filePath = await b64toImage(req.body)
                const image = await cloudinary.v2.uploader.upload(filePath);
                fs.unlink(filePath, (e) => {
                    if (e) res.status(500).json({ message: 'error on deal with image' })
                });

                return res.json({
                    url: image.secure_url,
                    public_id: image.public_id
                });

            } catch (error) {
                return res.status(500).json({ message: error })
            }
        })();
    },

    deleteImage(req, res) {
        if (!req.body) {
            return res.status(400).json({ message: 'no body' });
        }
        const { public_id } = req.body;
        (async () => {
            try {
                const response = await cloudinary.v2.api.delete_resources(public_id);

                if (response.deleted[public_id] == 'deleted') {
                    return res.status(200).json({ message: 'deleted' });
                }
                res.status(404).json({ message: 'wrong public_id' });
            } catch (error) {
                res.status(500).json({ message: error });
            }

        })()
    },
    /*     resendCode(req, res) {
            const now = Date.now();
            if (req.session.codeRequests > 1) {
                let { lastModify } = req.session.dates;
                let differSecs = (now - lastModify) / 1000;
    
                if (differSecs <= 120) {
                    // res.header('Retry-After', differSecs);
                    return res.status(429).json({
                        message: 'too many requests',
                        remainingTime: differSecs
                    });
                }
            }
            let authCode = getCode();
            let { email } = req.session;
            (async () => {
                try {
                    const response = await emailSender(email, authCode)
                    req.session.dates.lastModify = now;
                    req.session.authCode = authCode;
                    console.log(req.session);
                    res.json({
                        status: 'success',
                        message: 'send'
                    })
                } catch (error) {
                    res.status(500).json({
                        status: 'error',
                        message: error
                    })
                }
            })()
        }, */

};