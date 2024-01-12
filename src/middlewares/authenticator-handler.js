const CustomError = require('../utils/CustomError');
const asyncCatch = require('../utils/asyncCatch');
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
    resendCodeHandler: asyncCatch((req, res, next) => {
        if (req.session.codeRequests <= 1) {
            return next();
        }
        let lastModify = req.session.dates.lastModify;
        let remaining = (Date.now() - lastModify) / 1000;
        console.log(remaining);
        if (remaining < 120) {
            // let header = { 'Retry-After': remaining }
            let error = new CustomError('remaining: tantos segundos', 400);
            return next(error);
        }
        console.log('eu to aqui mano!!!!');
        return next();
    }),
    confirmCodeHandler(req, res, next) {
        const authCode = req.session.authCode;
        let userCode = req.body.authCode;
        if (authCode == userCode) {
            return next();
        }
        next(new CustomError('invalid code', 422));
    }
}