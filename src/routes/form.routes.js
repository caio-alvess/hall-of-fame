const express = require('express');
const form = new (require('../controllers/form.controller'))();
const router = express.Router();

router.use('/form', (req, res, next) => {
    console.log(req.session);
    if (!(req?.session?.hasConfirmedEmail ?? false)) {
        return res.redirect('/email/confirm');
    }
    next();
})
router
    .get('/form', form.getView)
    .post('/form', form.submit)

module.exports = router;

