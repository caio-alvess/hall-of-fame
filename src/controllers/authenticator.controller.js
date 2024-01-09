const emailSender = require('../utils/EmailSender');
const asyncCatch = require('../utils/asyncCatch');

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
    /**This will actually destroy the session and send user to previous page*/
    wrongEmail: asyncCatch((req, res) => {
        req.session.destroy(() => {
            return res.redirect('/email');
        })
    })
}