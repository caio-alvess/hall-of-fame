const { Router } = require('express');
const router = Router();
const api = require('../api/api');

router
    .get('/api/email', api.getUserEmail)
    .get('/api/users', api.getUsers)
    .post('/api/image', api.getImage)
    .delete('/api/image', api.deleteImage)

module.exports = router;