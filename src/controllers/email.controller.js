const emailSender = require('../utils/EmailSender');
const getCode = () => Math.floor(Math.random() * (999999 - 100000) + 100000);
const asyncCatch = require('../utils/asyncCatch');

module.exports = {
    getView(req, res) {
        res.render('./email/email.html');
    },
    post: asyncCatch(async (req, res) => {
        const email = req.body.email;
        const authCode = getCode();
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
        await emailSender(email, authCode);
        req.session.save((e) => {
            req.session.codeRequests++;
            return res.status(201).json({
                isValid: true,
                url: '/email/confirm'
            });
        })
    })
}