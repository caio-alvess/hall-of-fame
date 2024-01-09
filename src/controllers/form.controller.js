const { database: db } = require('../database/db');
const asyncCatch = require('../utils/asyncCatch');


module.exports = {
    view(req, res) {
        return res.render('./form/form.html');
    },
    submit: asyncCatch(async (req, res) => {
        const body = req.body;
        const email = req.session.email;
        await db.create({ ...body, email })
        return res.status(201).json({ status: 'success', message: 'created' });
    })
}