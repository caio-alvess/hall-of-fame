const CustomError = require('../utils/CustomError');
module.exports = {
    viewHandler(req, res, next) {
        if (!req.session.email) {
            return res.redirect('/email');
        }
        else if (req.session.hasConfirmedEmail) {
            return res.redirect('/form');
        }
        next();
    },
    confirmCodeHandler(req, res, next) {
        const authCode = req.session.authCode;
        let userCode = req.body.authCode;
        if (authCode == userCode) {
            return next();
        }
        next(new CustomError('invalid code', 422));
    }
}