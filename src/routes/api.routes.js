const { Router } = require('express');
const router = Router();
const api = new (require('../controllers/api'))();

router
    .get('/api/email', api.getUserEmail)
    .get('/api/users', api.getUsers)
    .post('/api/image', api.getImage)
    .delete('/api/image', api.deleteImage)

module.exports = router;