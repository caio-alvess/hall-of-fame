const express = require('express');
const form = require('../controllers/form.controller');
const formHandler = require('../middlewares/form-handler');
const router = express.Router();

router
    .get('/form', formHandler.viewHandler, form.view)
    .post('/form', formHandler.submitHandler, form.submit)

module.exports = router;

