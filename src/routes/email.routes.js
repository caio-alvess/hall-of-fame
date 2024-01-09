const express = require('express');
const email = require('../controllers/email.controller');
const emailHandlers = require('../middlewares/email-handler');
const router = express.Router();

router
    .get('/email', emailHandlers.viewHandler, email.getView)
    .post('/email', emailHandlers.checkEmail, email.post)
module.exports = router;