const router = require('express').Router();
const auth = require('../controllers/authenticator.controller');
const authHandler = require('../middlewares/authenticator-handler');
/* 
router.use('/email/confirm', (req, res, next) => {
    if (!req.session.tempSession || !req.session.tempSession.email) {
        res.redirect('/email');
        return next();
    }
    if (req.session.tempSession.hasConfirmedEmail) {
        res.redirect('/form');
        return next();
    }
    next();
}) */

router
    .get('/email/confirm', authHandler.viewHandler, auth.view)
    .get('/email/resend-code', authHandler.resendCodeHandler, auth.resendCode)
    .post('/email/confirm', authHandler.confirmCodeHandler, auth.confirmCode)
    .delete('/email/confirm', auth.wrongEmail)

module.exports = router;