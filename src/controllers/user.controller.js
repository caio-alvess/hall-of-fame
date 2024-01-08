const { Database } = require('../database/db');
const db = new Database();

module.exports = class User {
    update(req, res) {
        if (!req.body) {
            return res.status(400).json({ message: 'No body' });
        }
        const { user, id } = req.body;
    }


}