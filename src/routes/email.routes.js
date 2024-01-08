const express = require('express');
const EmailControllers = require('../controllers/email.controller');
const email = new EmailControllers.Email();
const emailConfirm = new EmailControllers.EmailConfirm();

const router = express.Router();


router
    .get('/email', email.getView)
    .post('/email', email.post)

    // email/confirm

    .get('/email/confirm', emailConfirm.getView)
    .post('/email/confirm', emailConfirm.post)
    .delete('/email/confirm', emailConfirm.wrongEmail)

    .get('/api/email/resend', emailConfirm.resendCode)
module.exports = router;