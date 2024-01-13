const CustomError = require('../utils/CustomError');
module.exports = {
    viewHandler(req, res, next) {
        if (!req.session.hasConfirmedEmail) {
            return res.redirect('/email/confirm');
        }
        next();
    },
    submitHandler(req, res, next) {
        const wishList = ['name', 'socialmedia', 'socialmediaUser', 'img_url', 'message'];
        for (let checker of wishList) {
            if (!req.body.hasOwnProperty(checker)) {
                return next(new CustomError('missing properties', 400))
            }
        }
        next();
    }
} 