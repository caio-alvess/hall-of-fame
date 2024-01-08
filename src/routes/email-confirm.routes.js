const router = require('express').Router();
const emailConfirm = new (require('../controllers/email-confirm.controller'))();

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
})

router
    .get('/email/confirm', emailConfirm.getView)
    .post('/email/confirm', emailConfirm.post)
    .delete('/email/confirm', emailConfirm.wrongEmail)

module.exports = router;