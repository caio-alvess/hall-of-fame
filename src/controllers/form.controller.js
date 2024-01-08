const path = require('node:path');
const { Database } = require('../database/db');
const db = new Database();
class Form {
    getView(req, res) {
        return res.render('./form/form.html');
    }
    submit(req, res) {
        const { email } = req.session;
        const wishList = ['name', 'socialmedia', 'socialmediaUser', 'img_url'];
        const body = req.body;
        for (let checker of wishList) {
            if (!body.hasOwnProperty(checker)) {
                return res.status(400).json({ message: 'missing properties' });
            }
        }
        //create user
        db.create({ ...body, email })
            .then(() => {
                res.status(201).json({ message: 'created' });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ message: err });

            })
    }
}
module.exports = Form;