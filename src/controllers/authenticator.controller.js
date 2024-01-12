const emailSender = require('../utils/EmailSender');
const asyncCatch = require('../utils/asyncCatch');
const getCode = require('../utils/getCode');

module.exports = {
    //when send with auth code
    view(req, res) {
        res.render('./email/email-confirm', { email: req.session.email });
    },
    confirmCode: asyncCatch((req, res) => {
        req.session.save(() => {
            req.session.hasConfirmedEmail = true;
            return res.redirect('/form');
        })
    }),
    resendCode: asyncCatch(async (req, res) => {
        let email = req.session.email;

        let authCode = getCode();
        req.session.codeRequests++;
        req.session.authCode = authCode;
        req.session.dates.lastModify = Date.now();

        await emailSender(email, authCode);
        res.status(200).json({
            status: 'success',
            message: `a new code has been sent to email: ${email}`
        });

    }),
    /**This will actually destroy the session and send user to previous page*/
    wrongEmail: asyncCatch((req, res) => {
        req.session.destroy(() => {
            return res.redirect('/email');
        })
    })
}