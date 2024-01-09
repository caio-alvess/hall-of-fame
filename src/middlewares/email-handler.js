const db = require('../database/db').database;
const CustomError = require('../utils/CustomError');
const asyncCatch = require('../utils/asyncCatch');

const isEmailValid = async (email, next) => {
    let res = await db.preciseList({ type: 'email', value: email })
    if (res.rowCount >= 1) {
        return false;
    }
    return true;
}

module.exports = {
    viewHandler(req, res, next) {
        if (req.session?.email ?? false) {
            return res.redirect('/email/confirm');
        }
        next();
    },

    checkEmail: asyncCatch(async (req, res, next) => {
        if (!req.body.email) {
            let error = new CustomError('empty request', 400);
            next(error);
        };

        const email = req.body.email;
        let status = await isEmailValid(email, next)
        if (!status) {
            let error = new CustomError('this email already exists', 409);
            next(error);
        }
        next();
    }),

}