//database here
const path = require('path');
const emailSender = require('../../modules/email-sender');
// const crypt = new Crypt(process.env.CRYPT_KEY, process.env.CRYPT_IV)
const db = new (require('../database/db').Database)();

function isValidEmail(email) {
    return new Promise((resolve, reject) => {
        db.preciseList({ type: 'email', value: email })
            .then((res) => {
                if (res.rowCount >= 1) {
                    resolve(false);
                }
                resolve(true);
            })
            .catch(err => {
                reject(false);
            })
    })
}

const getCode = () => Math.floor(Math.random() * (999999 - 100000) + 100000);


class Email {
    getView(req, res) {
        if (req.session?.email ?? false) {
            return res.redirect('/email/confirm');
        }
        res.render('./email/email.html');
    }

    async post(req, res) {
        const email = req.body.email;
        console.log(email);
        const authCode = getCode();
        let isValid = null;
        try {
            isValid = await isValidEmail(email);
            console.log(isValid);
            if (!isValid) {
                return res.status(201).json({
                    isValid,
                    message: 'Ops, esse email já está sendo utilizado.'
                })
            }
        } catch (error) {
            res.status(503).json({
                status: 'error',
                message: 'error on database query'
            });
        }
        const tempSession = {
            dates: Object.defineProperties({}, {
                created: {
                    value: Date.now(),
                    enumerable: true,
                },
                lastModify: {
                    value: Date.now(),
                    enumerable: true,
                    writable: true,
                }
            }),
            email,
            authCode,
            hasConfirmedEmail: false,
            codeRequests: 0
        }
        Object.assign(req.session, tempSession);
        console.log(req.session);
        try {
            const response = await emailSender(email, authCode);
            req.session.save((e) => {
                if (e) throw new Error(e);

                req.session.codeRequests++;
                return res.status(201).json({
                    isValid,
                    url: '/email/confirm'
                });
            })
        } catch (e) {
            res.status(500).json({ message: e });
        }
    }
}

class EmailConfirm {
    //when send with auth code
    getView(req, res) {
        if (!(req.session?.email ?? false)) {
            return res.redirect('/email');
        }
        else if (req.session.hasConfirmedEmail) {
            return res.redirect('/form');
        }
        res.render('./email/email-confirm', { email: req.session.email });
    }
    async post(req, res) {
        const { authCode } = req.session;
        let userCode = req.body.authCode;
        console.log(req.session)
        if (!userCode) {
            res.json({
                status: 'error',
                message: 'Código inválido',
            })
        }
        if (authCode == userCode) {
            req.session.save(e => {
                if (e) {
                    return res.json({
                        status: 'error',
                        message: 'Erro temporário no servidor. Se o erro persistir, por favor, entre em contato.'
                    });
                }
                req.session.hasConfirmedEmail = true;

                return res.redirect('/form');
            })
        }
        else {
            return res.json({
                status: 'error',
                message: 'Código incorreto'
            })
        }
    }

    resendCode(req, res) {
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



    }

    /**This will actually destroy the session and send user to previous page*/
    wrongEmail(req, res) {

        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(503).json({
                    status: 'error',
                    message: 'Erro interno. Se o problema persistir, entre com contato com o administrador.'
                })
            }
            console.log('ola, deu bom hein')
            return res.redirect('/email');
        })
    }
}

module.exports = { Email, EmailConfirm };